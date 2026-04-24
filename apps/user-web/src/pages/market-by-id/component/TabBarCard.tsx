import { Card } from "@/components/ui/card";
import type { MarketStatus, Outcomes } from "../types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ChartTab from "./ChartTab";
import OverviewTab from "./OverviewTab";
import HistoryTab from "./HistoryTab";
import DiscussionTab from "./DiscussionTab";

const tabBarTitlesAndValue = [
  { value: "chart", title: "Chart" },
  { value: "overview", title: "Overview" },
  { value: "discussions", title: "Discussions" },
  { value: "history", title: "History" },
];

export default function TabBarCard({
  outcomes,
  marketId,
  marketStatus,
}: {
  outcomes: Outcomes[];
  marketId: string;
  marketStatus: MarketStatus;
}) {
  const tabBarData = [
    { value: "chart", content: ChartTab({ marketId }) },
    { value: "overview", content: OverviewTab({ marketId, outcomes }) },
    { value: "history", content: HistoryTab({ marketId }) },
    {
      value: "discussions",
      content: DiscussionTab({ marketId, marketStatus }),
    },
  ];
  return (
    <Card className="px-4 max-w-4xl">
      <Tabs defaultValue="chart">
        <TabsList variant={"line"}>
          {tabBarTitlesAndValue.map((tab) => (
            <TabsTrigger value={tab.value} key={tab.title}>
              {tab.title}
            </TabsTrigger>
          ))}
        </TabsList>
        {tabBarData.map((tabBar) => (
          <TabsContent value={tabBar.value} key={tabBar.value}>
            {tabBar.content}
          </TabsContent>
        ))}
      </Tabs>
    </Card>
  );
}
