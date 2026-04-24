import { useParams } from "react-router-dom";
import { useMarketById } from "./hooks/useMarketById";
import type { MarketStatus } from "./types";
import TabBarCard from "./component/TabBarCard";
import OrderCard from "./component/OrderCard";
import MarketMetaData from "./component/MarketMetaData";
import MarketDescriptions from "./component/MarketDescriptions";

export default function MarketById() {
  const marketId = useParams().id;

  const { data, errorMessage, isError, isLoading } = useMarketById({
    marketId: marketId!,
  });

  return isLoading ? (
    <div>Loading</div>
  ) : isError ? (
    <div>{errorMessage?.message}</div>
  ) : (
    <div>
      {data && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left side */}
          <div className="space-y-2 lg:col-span-2">
            <MarketMetaData
              title={data.title}
              closing={data.closing}
              type={data.marketType}
            />
            <TabBarCard
              marketId={marketId!}
              marketStatus={data.marketStatus as MarketStatus}
              outcomes={data.outcomes}
            />
            <MarketDescriptions
              description={data.description}
              settlementRules={data.settlementRules}
            />
          </div>
          {/* Right side */}
          <div className="relative">
            <div className="sticky top-35 self-start">
              <OrderCard outcomes={data.outcomes} marketId={marketId!} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
