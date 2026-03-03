import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BACKEND_URL } from "@/lib/utils";
import { IconLoader2 } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

interface MarketData {
  marketTitle: string;
  description: string;
  settlementRules: string;
  marketType: string;
  closing: number;
  outcomes: {
    outcomeTitle: string;
    price: string;
    volume: number;
  }[];
}

interface FetchMarketByIdRes {
  success: boolean;
  message: string;
  marketData: MarketData;
}

export default function MarketById() {
  const marketId = useParams().id;

  const fetchMarketById = async (): Promise<FetchMarketByIdRes> => {
    const res = await fetch(
      `${BACKEND_URL}/market/get-market-by-id?marketId=${marketId}`,
    );

    const response = await res.json();

    if (!response.success) {
      throw new Error(response.message);
    }

    return response;
  };

  const getMarketById = useQuery({
    queryKey: ["market-by-id"],
    queryFn: fetchMarketById,
  });

  if (getMarketById.isPending) {
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <IconLoader2 size={25} className="animate-spin" />
      </div>
    );
  }

  return (
    <div>
      {getMarketById.data && (
        <>
          <div className="space-y-2">
            <div>
              <h1 className="text-2xl font-semibold">
                {getMarketById.data.marketData.marketTitle}
              </h1>
              <Badge>
                <span className="capitalize font-semibold">
                  {getMarketById.data.marketData.marketType}
                </span>
              </Badge>
            </div>

            <div>
              <p className="line-clamp-4 w-96 text-sm text-gray-600">
                {getMarketById.data.marketData.description}
              </p>
              <p className="line-clamp-4 w-96 text-sm text-gray-600">
                {getMarketById.data.marketData.settlementRules}
              </p>
            </div>

            <div>
              <Card className="max-w-4xl w-full px-4">
                <Tabs defaultValue="overview">
                  <TabsList variant={"line"}>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="discussions">Discussions</TabsTrigger>
                    <TabsTrigger value="history">History</TabsTrigger>
                  </TabsList>
                  <TabsContent value="overview">
                    <Card className="px-4">
                      <div>
                        <p className="font-semibold text-xl">Betting options</p>
                      </div>

                      <div>
                        {getMarketById.data.marketData.outcomes.map(
                          (outcome, i) => (
                            <div key={i} className="mb-4">
                              <p className="text-lg font-semibold mb-1 flex items-center gap-4">
                                <span>{outcome.outcomeTitle}</span>
                                <span className="text-gray-500">
                                  <Badge variant={"outline"}>
                                    Volume- {outcome.volume}
                                  </Badge>
                                </span>
                              </p>

                              <div className="flex items-center gap-3">
                                <div className="flex-1">
                                  <Progress
                                    value={
                                      Number(Number(outcome.price).toFixed(2)) *
                                      100
                                    }
                                  />
                                </div>
                                <div className="flex gap-2 whitespace-nowrap text-sm font-medium">
                                  <span>
                                    <Badge variant={"outline"}>
                                      {Number(
                                        Number(outcome.price).toFixed(2),
                                      ) * 100}
                                      %
                                    </Badge>
                                  </span>
                                </div>
                              </div>
                            </div>
                          ),
                        )}
                      </div>
                    </Card>
                  </TabsContent>
                  <TabsContent value="discussions">
                    <Card className="px-4">hey there discussions</Card>
                  </TabsContent>
                  <TabsContent value="history">
                    <Card className="px-4">hey there history</Card>
                  </TabsContent>
                </Tabs>
              </Card>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
