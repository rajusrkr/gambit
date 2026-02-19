import { cryptoCategory, db, market, sportsCategory } from "@repo/db";
import { Request, Response } from "express";
import { z } from "zod";

interface MatchResponse {
  response: {
    fixture: {
      id: string;
      timestamp: number;
      status: {
        short: string;
        long: string;
      };
    };
    league: {
      name: string;
    };
    teams: {
      home: {
        name: string;
      };
      away: {
        name: string;
      };
    };
  }[];
}
interface AdminSession {
  name: string;
  email: string;
  emailVerified: boolean;
  image: string | null;
  createdAt: string;
  updatedAt: string;
  twoFactorEnabled: boolean;
  username: string | null;
  displayUsername: string | null;
  role: string;
  isFullNameVisible: boolean;
  isUserNameVisible: boolean;
  approval: string;
  permissions: string[] | null;
  id: string;
}

interface CreateMarketDBTransactionRes {
  marketId: string;
}

const MIN_MARKET_START = new Date().getTime();
const outcomeSchema = z.object({
  title: z.string(),
  price: z.number(),
  volume: z.number(),
});

const schema = z.discriminatedUnion("category", [
  // Sports category
  z
    .object({
      category: z.literal("sports"),
      title: z
        .string()
        .trim()
        .min(10, "Title should be at least 10 characters long"),
      description: z
        .string()
        .trim()
        .min(15, "Description should be at least 20 characters long"),
      settlementRules: z
        .string()
        .trim()
        .min(15, "Settlement rules should be at least 20 characters long"),
      outcomes: z
        .array(outcomeSchema)
        .min(2, "At least 2 outcomes is required"),
      marketStarts: z
        .number()
        .min(
          MIN_MARKET_START,
          "Select a valid market start time. (Market start time should be greater than current time)",
        )
        .transform((data) => Math.floor(data / 1000)),
      marketEnds: z.number().transform((data) => Math.floor(data / 1000)),
      matchId: z.string().trim().min(7, "Selected match id is not valid"),
      match: z
        .string()
        .trim()
        .min(5, "A valid match length should be atleast 5 characters long"),

      matchStarts: z.number(),
      matchEnds: z.number(),
    })
    .refine((data) => data.marketStarts < data.marketEnds, {
      message: "Market end should be greater than market start time",
      path: ["marketEnds"],
    }),
  // Crypto category
  z
    .object({
      category: z.literal("crypto"),
      title: z
        .string()
        .trim()
        .min(10, "Title should be at least 10 characters long"),
      description: z
        .string()
        .trim()
        .min(15, "Description should be at least 20 characters long"),
      settlementRules: z
        .string()
        .trim()
        .min(15, "Settlement rules should be at least 20 characters long"),
      outcomes: z
        .array(outcomeSchema)
        .min(2, "At least 2 outcomes is required"),
      marketStarts: z
        .number()
        .min(
          MIN_MARKET_START,
          "Select a valid market start time. (Market start time should be greater than current time)",
        )
        .transform((data) => Math.floor(data / 1000)),
      marketEnds: z.number().transform((data) => Math.floor(data / 1000)),
      cryptoName: z
        .string()
        .trim()
        .min(3, "A valid crypto name should be atleast 3 characters long"),
      interval: z
        .string()
        .trim()
        .length(2, "Interval length can't be more or less than 2 characters"),
    })
    .refine((data) => data.marketStarts < data.marketEnds, {
      message: "Market end should be greater than start time",
      path: ["marketEnds"],
    }),
]);

function getTime(timestamp: number) {
  const dateFromTimeStamp = new Date(timestamp * 1000);

  const hours = dateFromTimeStamp.getHours().toString().padStart(2, "0");
  const minutes = dateFromTimeStamp.getMinutes().toString().padStart(2, "0");
  const seconds = dateFromTimeStamp.getSeconds().toString().padStart(2, "0");

  const time = `${hours}:${minutes}:${seconds}`;

  return time;
}

export const fetchFootball = async (req: Request, res: Response) => {
  const urlData = req.query;
  const date = urlData.date;

  if (!date) {
    return res.status(400).json({
      success: false,
      message: "Valid date is required to fetch matches",
      matches: [],
    });
  }

  try {
    const fetchMatches = await fetch(
      `${process.env.FETCH_MATCH_URL}/fixtures?date=${date}`,
      {
        method: "GET",
        headers: { "x-apisports-key": process.env.SPORTS_API_KEY! },
      },
    );

    const matches: MatchResponse = await fetchMatches.json();
    if (matches.response.length === 0) {
      return res.status(400).json({
        success: false,
        message:
          "Unable to fetch matches for the selected date, try again with different one",
        matches: [],
      });
    }

    // Filter matches based on status
    const filteredMatches = matches.response
      .filter(
        (match) =>
          match.fixture.status.short === "NS" &&
          match.fixture.timestamp > Math.floor(new Date().getTime() / 1000),
      )
      .map((filteredMatches) => ({
        matchId: filteredMatches.fixture.id,
        timestamp: filteredMatches.fixture.timestamp,
        time: getTime(filteredMatches.fixture.timestamp),
        leagueName: filteredMatches.league.name,
        teamsHome: filteredMatches.teams.home.name,
        teamsAway: filteredMatches.teams.away.name,
        status: {
          short: filteredMatches.fixture.status.short,
          long: filteredMatches.fixture.status.long,
        },
      }));

    return res.status(200).json({
      success: true,
      message: "Matches fetched successfully",
      matches: filteredMatches,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error", matches: [] });
  }
};
export const createMarket = async (req: Request, res: Response) => {
  const data = req.body;

  // Get admin id
  // @ts-ignore, user data is available
  const adminSession: AdminSession = req.user;
  const validate = schema.safeParse(data);
  const { success, data: marketData, error } = validate;

  if (!success) {
    const errorMessage = error.issues[0].message;
    return res.status(400).json({ success: false, message: errorMessage });
  }

  try {
    const dbTransactionResult = await db.transaction(
      async (tx): Promise<CreateMarketDBTransactionRes> => {
        const [newMarket] = await tx
          .insert(market)
          .values({
            category: marketData.category,
            description: marketData.description,
            settlementRules: marketData.settlementRules,
            title: marketData.title,
            outcomes: marketData.outcomes,
            marketEnds: marketData.marketEnds,
            marketStarts: marketData.marketStarts,
            createdBy: adminSession.id,
          })
          .returning({ marketId: market.id });

        switch (marketData.category) {
          case "crypto":
            await tx.insert(cryptoCategory).values({
              cryptoName: marketData.cryptoName,
              interval: marketData.interval,
              marketId: newMarket.marketId,
            });
            break;

          case "sports":
            await tx.insert(sportsCategory).values({
              match: marketData.match,
              matchId: marketData.matchId,
              matchStarts: marketData.matchStarts,
              matchEnds: marketData.matchEnds,
              marketId: newMarket.marketId,
            });
            break;
          default:
            throw new Error("Unknow category, please provide a valid category");
        }

        return { marketId: newMarket.marketId };
      },
    );

    return res.status(200).json({
      success: true,
      message: "Market created successfully",
      marketId: dbTransactionResult.marketId,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Internal server error",
    });
  }
};
