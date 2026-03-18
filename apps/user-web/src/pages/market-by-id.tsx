import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useWebsocket } from "@/components/web-socket-provider";
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
// ==================================
// Sub components
// ==================================
function MarketMetaData({
  title,
  closing,
  type,
}: {
  title: string;
  type: string;
  closing: number;
}) {
  return (
    <div>
      <h1 className="text-2xl font-semibold">{title}</h1>
      <Badge>
        <span className="capitalize font-semibold">{type}</span>
      </Badge>
      <Badge variant={"link"}>
        <span>Closes: {new Date(closing * 1000).toDateString()}</span>
      </Badge>
    </div>
  );
}
function ChartTabContent() {
  return <div>chart tab content</div>;
}
function OverviewTabContent({
  outcomes,
}: {
  outcomes: {
    outcomeTitle: string;
    price: string;
    volume: number;
  }[];
}) {
  return (
    <Card className="px-4">
      <div>
        <p className="font-semibold text-xl">Betting options</p>
      </div>

      <div>
        {outcomes.map((outcome, i) => (
          <div key={i} className="mb-4">
            <p className="text-lg font-semibold mb-1 flex items-center gap-4">
              <span>{outcome.outcomeTitle}</span>
              <span className="text-gray-500">
                <Badge variant={"outline"}>Volume: {outcome.volume}</Badge>
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
                    {Number(Number(outcome.price).toFixed(2)) * 100}%
                  </Badge>
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
function DiscussionsTabContent() {
  return <Card className="px-4">DiscussionsTabContent</Card>;
}
function HistoryTabContent() {
  return <Card className="px-4">HistoryTabContent</Card>;
}
const tabs = [
  { value: "chart", title: "Chart" },
  { value: "overview", title: "Overview" },
  { value: "discussions", title: "Discussions" },
  { value: "history", title: "History" },
];
function DataCard({
  outcomes,
}: {
  outcomes: {
    outcomeTitle: string;
    price: string;
    volume: number;
  }[];
}) {
  return (
    <Card className="px-4 max-w-4xl">
      <Tabs defaultValue="chart">
        <TabsList variant={"line"}>
          {tabs.map((tab, i) => (
            <TabsTrigger value={tab.value} key={i}>
              {tab.title}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Tab contents */}
        <TabsContent value="chart">
          <ChartTabContent />
        </TabsContent>
        <TabsContent value="overview">
          <OverviewTabContent outcomes={outcomes} />
        </TabsContent>
        <TabsContent value="discussions">
          <DiscussionsTabContent />
        </TabsContent>
        <TabsContent value="history">
          <HistoryTabContent />
        </TabsContent>
      </Tabs>
    </Card>
  );
}
function MarketDescriptionAndSettlementRules({
  description,
  settlementRules,
}: {
  description: string;
  settlementRules: string;
}) {
  return (
    <div className="pb-2">
      <h2 className="font-semibold">Description</h2>
      <p className="text-sm text-gray-500 max-w-4xl">{description}</p>
      <h2 className="font-semibold mt-2">Settlement Rules</h2>
      <p className="text-sm text-gray-500 max-w-4xl">{settlementRules}</p>
    </div>
  );
}
function OrderCard({
  outcomes,
}: {
  outcomes: {
    outcomeTitle: string;
    price: string;
    volume: number;
  }[];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Place order</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <Tabs defaultValue="buy">
          <TabsList variant={"line"}>
            <TabsTrigger value="buy">Buy</TabsTrigger>
            <TabsTrigger value="sell">Sell</TabsTrigger>
          </TabsList>

          <TabsContent value="buy">
            <div className="flex flex-col space-y-1">
              {outcomes.map((outcome, i) => (
                <Button key={i} variant={"outline"}>
                  {outcome.outcomeTitle}
                </Button>
              ))}
            </div>
            <div className="py-2">
              <Label htmlFor="order-quantity" className="mb-1">
                Quantity
              </Label>
              <Input type="number" required placeholder="Enter qty. eg: 100" />
            </div>
            <div>
              <Button className="w-full">Buy</Button>
            </div>
          </TabsContent>
          <TabsContent value="sell">
            <div className="flex flex-col space-y-1">
              {outcomes.map((outcome, i) => (
                <Button key={i} variant={"outline"}>
                  {outcome.outcomeTitle}
                </Button>
              ))}
            </div>
            <div className="py-2">
              <Label htmlFor="order-quantity" className="mb-1">
                Quantity
              </Label>
              <Input type="number" required placeholder="Enter qty. eg: 100" />
            </div>
            <div>
              <Button className="w-full" variant={"destructive"}>
                Sell
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

export default function MarketById() {
  const marketId = useParams().id;
  const { sendMessage } = useWebsocket();
  const fetchMarketById = async (): Promise<FetchMarketByIdRes> => {
    const res = await fetch(
      `${BACKEND_URL}/market/get-market-by-id?marketId=${marketId}`,
    );
    const response = await res.json();
    if (!response.success) {
      throw new Error(response.message);
    }

    const data = response as FetchMarketByIdRes;
    if (data.success) {
      sendMessage({
        type: "TICKER_UPDATE",
        message: "Want to sub for ticker update",
        payload: { pageRef: "market:id", roomsToSub: [marketId!] },
      });
    }

    return data;
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

  const getData = (): MarketData => {
    return getMarketById.data!.marketData;
  };
  const {
    marketTitle,
    description,
    settlementRules,
    closing,
    marketType,
    outcomes,
  } = getData();

  return (
    <div>
      {getMarketById.data && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left side */}
            <div className="space-y-2 lg:col-span-2">
              <MarketMetaData
                title={marketTitle}
                closing={closing}
                type={marketType}
              />
              <DataCard outcomes={outcomes} />
              <MarketDescriptionAndSettlementRules
                description={description}
                settlementRules={settlementRules}
              />
            </div>
            {/* Right side */}
            <div className="relative">
              <div className="sticky top-20 self-start">
                <OrderCard outcomes={outcomes} />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
