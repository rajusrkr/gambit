import { IconLoader2 } from "@tabler/icons-react";
import { usePriceHistory } from "../hooks/usePriceHistory";
import MarketPriceChart from "./MarketPriceChart";

export default function ChartTab({ marketId }: { marketId: string }) {
  const { data, errorMessage, isError, isLoading } = usePriceHistory({
    marketId,
  });

  return isLoading ? (
    <div className="h-96 flex justify-center items-center">
      <span className="animate-spin">
        <IconLoader2 />
      </span>
    </div>
  ) : isError ? (
    <div className="h-96 flex justify-center items-center">
      <p className="font-semibold underline underline-offset-2">
        {errorMessage?.message}
      </p>
    </div>
  ) : (
    <div className="h-96">
      <div>
        <h3 className="text-2xl font-semibold">Chart</h3>
        <p className="font-semibold text-gray-500">
          Showing all prices in a single chart. Take mouse on chart to see data
        </p>
      </div>
      <div>{data && <MarketPriceChart chartData={data} />}</div>
    </div>
  );
}
