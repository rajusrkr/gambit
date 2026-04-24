import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { useOrder } from "../hooks/useOrder";
import { IconBook2, IconLoader2 } from "@tabler/icons-react";

export default function HistoryTab({ marketId }: { marketId: string }) {
  const {
    data: orderData,
    errorMessage,
    isError,
    isLoading,
  } = useOrder({ marketId });

  return isLoading ? (
    <div className="h-96 flex justify-center items-center">
      <IconLoader2 className="animate-spin" />
    </div>
  ) : isError ? (
    <div className="h-96 flex justify-center items-center">
      <p className="font-semibold underline underline-offset-2">
        {errorMessage?.message}
      </p>
    </div>
  ) : (
    <div className="h-96">
      <div className="mb-2">
        <h3 className="text-2xl font-semibold">Order history</h3>
        <p className="font-semibold text-gray-500">
          Order history of all users for this market
        </p>
      </div>

      <div>
        {orderData?.length === 0 ? (
          <div className="h-96 flex justify-center items-center">
            <p className="font-semibold underline underline-offset-2">
              No order history available to show.
            </p>
          </div>
        ) : (
          <div className="space-y-1 max-h-96 overflow-y-auto no-scrollbar mask-[linear-gradient(to_bottom,black_80%,transparent_100%)] pb-10">
            {orderData?.map((order) => (
              <Item key={order.orderId} variant={"outline"}>
                <ItemMedia>
                  <IconBook2 />
                </ItemMedia>
                <ItemContent>
                  <ItemTitle>Outcome: {order.outcome}</ItemTitle>
                  <ItemDescription className="flex gap-2">
                    <span>QTY: {order.qty}</span>
                    <span>
                      Avg Price:{" "}
                      {Math.floor(Number(order.avgPrice) * 100) / 100}
                    </span>
                    <span>Ordered By: {order.orderedBy}</span>
                  </ItemDescription>
                </ItemContent>
              </Item>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
