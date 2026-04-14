import type { MarketData } from "@/api/market";
import { useMarket } from "@/pages/markets/hooks/useMarket";
import MarketCards from "./market-cards";

export default function AllMarketCards() {
	const { data, isLoading } = useMarket({
		category: "all",
		status: "all",
		limit: "3",
	});
	return (
		<div>
			<MarketCards data={data as MarketData[]} isLoading={isLoading} />
		</div>
	);
}
