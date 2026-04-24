import { Badge } from "@/components/ui/badge";

export default function MarketMetaData({
  title,
  closing,
  type,
}: {
  title: string;
  type: string;
  closing: number;
}) {
  return (
    <div className="mb-4">
      <h1 className="text-2xl font-semibold">{title}</h1>
      <div className="items-center flex gap-2">
        <Badge>
          <span className="capitalize font-semibold">{type}</span>
        </Badge>
        <span className="text-xs text-gray-400">
          Closes: {new Date(closing * 1000).toDateString()}
        </span>
      </div>
    </div>
  );
}
