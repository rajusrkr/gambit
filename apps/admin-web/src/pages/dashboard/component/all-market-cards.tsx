import type { MarketData } from "@/api/market";
import { useMarket } from "@/hooks/tanstack/useMarket";
import MarketCards from "./market-cards";

export default function AllMarketCards() {
	const { data, isLoading } = useMarket();
	return (
		<div>
			<MarketCards data={data as MarketData[]} isLoading={isLoading} />
		</div>
	);
}
