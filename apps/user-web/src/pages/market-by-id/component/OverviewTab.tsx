import { Badge } from "@/components/ui/badge";
import { useLatestPrice } from "../hooks/useLatestPrice";
import { usePositionByMarketId } from "../hooks/usePositionByMarketId";
import { useMarketByIdStore } from "../zustand-store";
import { calculatePnl } from "@/lib/calculate-pnl";
import { Progress } from "@/components/ui/progress";
import { IconLoader2 } from "@tabler/icons-react";

export default function OverviewTab({
  outcomes,
  marketId,
}: {
  outcomes: {
    outcomeTitle: string;
    price: string;
    volume: number;
  }[];
  marketId: string;
}) {
  const { setDefaultTab, setSelectedPosition } = useMarketByIdStore();
  const { data: positionData } = usePositionByMarketId({ marketId });
  const {
    data: latestPriceData,
    errorMessage: latestPriceDataErrorMessage,
    isError: isLatestPriceError,
    isLoading: isLatestPriceLoading,
  } = useLatestPrice({ marketId });

  return isLatestPriceLoading ? (
     <div className="h-96 flex justify-center items-center">
      <span className="animate-spin">
        <IconLoader2 />
      </span>
    </div>
  ) : isLatestPriceError ? (
  <div className="h-96 flex justify-center items-center">
      <p>{latestPriceDataErrorMessage?.message}</p>
    </div>  ) : (
    <div className="h-96">
      <div className="mb-8 pb-2">
        <div className="text-2xl font-semibold">Betting options</div>
        <div className="font-semibold text-gray-500">
          All betting options listed below
        </div>
      </div>
      <div>
        <div>
          {outcomes.map((outcome) => (
            <div key={outcome.outcomeTitle} className="mb-4">
              <p className="text-lg font-semibold mb-1 flex items-center gap-4">
                <span>{outcome.outcomeTitle}</span>
                <span className="text-gray-500 space-x-2">
                  <Badge variant={"outline"} className="select-none">
                    Volume: {outcome.volume}
                  </Badge>
                  {positionData?.find(
                    (position) => position.outcome === outcome.outcomeTitle,
                  ) && (
                    <Badge className="select-none">
                      <span className="font-semibold">Position</span>
                    </Badge>
                  )}

                  {positionData?.find(
                    (position) => position.outcome === outcome.outcomeTitle,
                  ) && (
                    <Badge
                      onClick={() => {
                        setDefaultTab({ defaultTab: "sell" });
                        setSelectedPosition({
                          selectedPosition: outcome.outcomeTitle,
                        });
                      }}
                      className={`${
                        calculatePnl({
                          marketId: marketId,
                          latestPrices: latestPriceData!,
                          outcomeTitle: outcome.outcomeTitle,
                          positions: positionData,
                        }) > 0 && "bg-green-700"
                      } select-none hover:cursor-pointer`}
                      variant={
                        calculatePnl({
                          marketId: marketId,
                          latestPrices: latestPriceData!,
                          outcomeTitle: outcome.outcomeTitle,
                          positions: positionData,
                        }) < 0
                          ? "destructive"
                          : "default"
                      }
                    >
                      <span className="font-semibold">
                        PNL:{" "}
                        {String(
                          calculatePnl({
                            marketId: marketId,
                            latestPrices: latestPriceData!,
                            outcomeTitle: outcome.outcomeTitle,
                            positions: positionData,
                          }),
                        )}
                      </span>
                    </Badge>
                  )}
                </span>
              </p>

              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <Progress
                    value={Number(Number(outcome.price).toFixed(2)) * 100}
                  />
                </div>

                <div className="flex gap-2 whitespace-nowrap text-sm font-medium">
                  <span>
                    <Badge variant={"outline"}>
                      {Number(Math.floor(Number(outcome.price) * 100))}%
                    </Badge>
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
