import { useEffect, useState } from "react";
import { useMarketByIdStore } from "../zustand-store";
import { usePositionByMarketId } from "../hooks/usePositionByMarketId";
import { useLatestPrice } from "../hooks/useLatestPrice";
import { useBuyOrder } from "../hooks/useBuyOrder";
import { useSellOrder } from "../hooks/useSellOrder";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item";
import { calculatePnl } from "@/lib/calculate-pnl";
import type { Outcomes } from "../types";

export default function OrderCard({
  marketId,
  outcomes,
}: {
  marketId: string;
  outcomes: Outcomes[];
}) {
  const [selectedButton, setSelectedButton] = useState<null | number>(null);
  const [quantity, setQuantity] = useState<number>(0);

  const { defaultTab, setDefaultTab, selectedPosition, setSelectedPosition } =
    useMarketByIdStore();
  const [selectedOutcome, setSelectedOutcome] = useState<null | string>(
    selectedPosition,
  );

  const { data: positions } = usePositionByMarketId({ marketId });
  const { data: latestPrices } = useLatestPrice({ marketId });

  const buyOrder = useBuyOrder({
    buyOrderData: {
      marketId: marketId,
      orderQty: quantity,
      orderType: "buy",
      selectedOutcome: selectedOutcome!,
    },
  });
  const sellOrder = useSellOrder({
    sellOrderData: {
      marketId: marketId,
      orderQty: quantity,
      orderType: "sell",
      positionId: "",
      selectedOutcome: selectedOutcome!,
    },
  });

  useEffect(() => {
    if (positions?.length === 0) {
      setDefaultTab({ defaultTab: "buy" });
    }
  }, [positions, defaultTab, marketId]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Place order</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <Tabs
          defaultValue={defaultTab}
          value={defaultTab}
          onValueChange={(e) => {
            setDefaultTab({ defaultTab: e as "buy" | "sell" });
          }}
        >
          <TabsList variant={"line"}>
            <TabsTrigger value="buy">Buy</TabsTrigger>
            {positions?.length !== 0 && (
              <TabsTrigger value="sell">Positions</TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="buy">
            <div className="flex flex-col space-y-1">
              {outcomes.map((outcome, i) => (
                <Button
                  className={`${i === selectedButton && "bg-accent-foreground text-accent hover:bg-accent-foreground"}`}
                  key={outcome.outcomeTitle}
                  variant={i === selectedButton ? "secondary" : "outline"}
                  onClick={() => {
                    setSelectedButton(i);
                    setSelectedOutcome(outcome.outcomeTitle);
                  }}
                >
                  {outcome.outcomeTitle}
                </Button>
              ))}
            </div>
            <div className="py-2">
              <Label htmlFor="order-quantity" className="mb-1">
                Quantity
              </Label>
              <Input
                type="number"
                required
                placeholder="Enter qty. eg: 100"
                defaultValue={quantity}
                onChange={(e) => {
                  setQuantity(Number(e.target.value));
                }}
              />
            </div>
            <div>
              <Button
                className="w-full"
                disabled={quantity === 0 || !selectedOutcome}
                onClick={() => {
                  buyOrder.mutate();
                }}
              >
                Buy
              </Button>
            </div>
          </TabsContent>
          <TabsContent value="sell">
            <div className="flex flex-col space-y-1">
              {positions?.map((position) => (
                <Item
                  key={position.outcome}
                  variant={"outline"}
                  className={`${selectedPosition === position.outcome && "bg-foreground text-background"} hover:cursor-pointer`}
                  onClick={() => {
                    setSelectedPosition({ selectedPosition: position.outcome });
                    setSelectedOutcome(position.outcome);
                  }}
                >
                  <ItemContent>
                    <ItemTitle>{position.outcome}</ItemTitle>
                    <ItemDescription>
                      <span>
                        PNL:{" "}
                        {calculatePnl({
                          marketId: marketId!,
                          latestPrices: latestPrices!,
                          outcomeTitle: position.outcome,
                          positions: positions,
                        })}
                      </span>
                      <span className="flex gap-2">
                        <span>QTY: {position.positionQty}</span>
                        <span>
                          Avg Price:{" "}
                          {Math.floor(Number(position.avgPrice) * 100) / 100}
                        </span>
                      </span>
                    </ItemDescription>
                  </ItemContent>
                </Item>
              ))}
            </div>
            <div className="py-2">
              <Label htmlFor="order-quantity" className="mb-1">
                Quantity
              </Label>
              <Input
                disabled={selectedPosition.length === 0}
                type="number"
                required
                placeholder="Enter qty. eg: 100"
                defaultValue={quantity}
                onChange={(e) => {
                  setQuantity(Number(e.target.value));
                }}
              />
            </div>
            <div>
              <Button
                className="w-full"
                variant={"destructive"}
                disabled={quantity === 0}
                onClick={() => {
                  sellOrder.mutate();
                  console.log("clicked");
                }}
              >
                Sell
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
