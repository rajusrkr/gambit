import { type ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
export type FootballMatch = {
  matchId: string;
  leagueName: string;
  teamsHome: string;
  teamsAway: string;
  time: string;
  timestamp: number;
};

export const footballMatchColumn: ColumnDef<FootballMatch>[] = [
  {
    id: "select",
    header: "Select",
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="select table"
      />
    ),
  },
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
    accessorKey: "time",
    header: "Time (24-hrs)"
  },
  {
    accessorKey: "timestamp",
    header: "Time (UTC secs)",
  },
];
