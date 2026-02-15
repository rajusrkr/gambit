import { type ColumnDef } from "@tanstack/react-table";
export type FootballMatch = {
  matchId: string;
  leagueName: string;
  teamsHome: string;
  teamsAway: string;
  timestamp: string;
};

export const footballMatchColumn: ColumnDef<FootballMatch>[] = [
  {
    accessorKey: "matchId",
    header: "Match Id",
  },
  {
    accessorKey: "leagueName",
    header: "League",
  },
  {
    accessorKey: "teamsHome",
    header: "Team -Home",
  },
  {
    accessorKey: "teamsAway",
    header: "Team -Away",
  },
  {
    accessorKey: "timestamp",
    header: "Time (24-hour)",
  },
];
