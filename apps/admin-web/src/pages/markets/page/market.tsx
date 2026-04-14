import MarketCards from "../component/market-cards";
import { useMarket } from "../hooks/useMarket";
import type { MarketData } from "../types/market";

export default function Market() {
	const { data, isLoading } = useMarket({
		category: "all",
		status: "all",
		limit: "3",
	});

	return (
		<div className="p-4">
			<div>
				<h3 className="text-2xl font-semibold pb-4">Markets</h3>
			</div>
			<MarketCards data={data as MarketData[]} isLoading={isLoading} />
		</div>
	);
}
