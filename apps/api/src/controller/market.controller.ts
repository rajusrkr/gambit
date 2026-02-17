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
