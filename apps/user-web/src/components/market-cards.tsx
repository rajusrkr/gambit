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

interface Market {
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
  const fetchMarket = async (): Promise<MarketFetchRes> => {
    const res = await fetch(`${BACKEND_URL}/market/get-market`);
    const response = await res.json();
    if (!response.success) {
      throw new Error(response.message.toString());
    }
    return response;
  };

  const getMarketQuery = useQuery({
    queryKey: ["markets"],
    queryFn: fetchMarket,
  });

  console.log(getMarketQuery.data);

  return (
    <div className="grid md:grid-cols-4 grid-cols-1 max-w-7xl mx-auto pt-4 md:px-0 px-4 gap-4">
      {getMarketQuery.data &&
        getMarketQuery.data.markets.map((market, i) => (
          <Card
            key={i}
            className="dark:bg-[#1e2428] relative dark:hover:bg-[#242b32] transition-all"
          >
            <CardHeader>
              <CardTitle>{market.title}</CardTitle>
            </CardHeader>

            <CardContent>
              {market.outcomes.length === 2 && (
                <div className="w-full flex gap-1">
                  {market.outcomes.map((outcome) => (
                    <Button className="flex-1 capitalize">
                      {outcome.title}
                    </Button>
                  ))}
                </div>
              )}

              {market.outcomes.length > 2 && (
                <div className="w-full grid grid-cols-3 gap-1 pb-4">
                  {market.outcomes.slice(0, 6).map((outcome) => (
                    <Button>{outcome.title}</Button>
                  ))}

                  {market.outcomes.length > 6 && (
                    <Button
                      className="text-foreground hover:cursor-pointer"
                      variant={"link"}
                    >
                      See more
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
            <CardFooter className="absolute bottom-0 pb-2">
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
