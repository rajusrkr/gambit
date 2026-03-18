import { BACKEND_URL } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import { useWebsocket } from "./web-socket-provider";

interface Market {
  id: string;
  title: string;
  outcomes: {
    title: string;
    price: string;
    volume: number;
  }[];
  currentStatus: string;
  closing: number;
}

interface MarketFetchRes {
  success: boolean;
  message: string;
  markets: Market[];
}

export default function MarketCards() {
  const { sendMessage } = useWebsocket();

  const fetchMarket = async (): Promise<MarketFetchRes> => {
    const res = await fetch(`${BACKEND_URL}/market/get-market`);
    const response = await res.json();
    if (!response.success) {
      throw new Error(response.message.toString());
    }

    const data = response as MarketFetchRes;
    if (data.success) {
      const marketIds: string[] = [];
      data.markets.forEach((market) => {
        marketIds.push(market.id);
      });

      sendMessage({
        type: "TICKER_UPDATE",
        message: "Sub to ticks",
        payload: { pageRef: "home", roomsToSub: marketIds },
      });
    }
    return data;
  };

  const getMarketQuery = useQuery({
    queryKey: ["markets"],
    queryFn: fetchMarket,
  });

  return (
    <div className="grid md:grid-cols-3 grid-cols-1 gap-4">
      {getMarketQuery.data &&
        getMarketQuery.data.markets.map((market, i) => (
          <Card
            key={i}
            className="dark:bg-[#1e2428] relative dark:hover:bg-[#242b32] transition-all"
          >
            <CardHeader className="h-10">
              <CardTitle className="text-xl font-bold">
                <Link to={`/market/${market.id}`}>
                  <span className="hover:underline underline-offset-1">
                    {market.title}
                  </span>
                </Link>
              </CardTitle>
            </CardHeader>

            <CardContent className="mb-2">
              {market.outcomes.length === 2 && (
                <div className="w-full flex gap-1">
                  {market.outcomes.map((outcome, i) => (
                    <Button className="flex-1 capitalize" key={i}>
                      {outcome.title}
                    </Button>
                  ))}
                </div>
              )}

              {market.outcomes.length > 2 && market.outcomes.length < 6 && (
                <div className="w-full grid grid-cols-3 gap-1 pb-4">
                  {market.outcomes.map((outcome, i) => (
                    <Button key={i}>{outcome.title}</Button>
                  ))}
                </div>
              )}

              {market.outcomes.length > 5 && (
                <div className="w-full grid grid-cols-3 gap-1 pb-4">
                  {[
                    ...market.outcomes.slice(0, 5),
                    { price: "0", volume: 0, title: "See more" },
                  ].map((outcome, i) => (
                    <Button key={i}>{outcome.title}</Button>
                  ))}
                </div>
              )}
            </CardContent>

            <CardFooter className="absolute bottom-0 pb-1">
              <div className="flex items-center gap-1">
                <span className="relative flex size-3">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-75"></span>
                  <span className="relative inline-flex size-3 rounded-full bg-green-500"></span>
                </span>
                <span className="capitalize">
                  {market.currentStatus.replaceAll("_", " ")}
                </span>
              </div>
            </CardFooter>
          </Card>
        ))}
    </div>
  );
}
