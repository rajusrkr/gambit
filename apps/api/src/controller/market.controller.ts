import { Request, Response } from "express";

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

export const fetchFootball = async (req: Request, res: Response) => {
  const urlData = req.query;
  const date = urlData.date;

  if (!date) {
    return res.status(400).json({
      success: false,
      message: "Valid date is required to fetch matches",
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
        message: "Unable to fetch matches, try again with proper inputs",
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
        leagueName: filteredMatches.league.name,
        teams: {
          home: filteredMatches.teams.home.name,
          away: filteredMatches.teams.away.name,
        },
        status: {
          short: filteredMatches.fixture.status.short,
          long: filteredMatches.fixture.status.long,
        },
      }));

    return res.status(200).json({ success: true, matches: filteredMatches });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
