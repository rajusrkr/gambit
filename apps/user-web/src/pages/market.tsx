import MarketCards from "@/components/market-cards";
// import { Button } from "@/components/ui/button";
// import type { LatestPrice } from "@/hooks/fetch/useMarket";
// import { useQueryClient } from "@tanstack/react-query";

/**
 * Default home page. The user will land this page after login. The markets will be shown here as cards.
 */

export default function Market() {
	// const queryClient = useQueryClient();

	return (
		<div>
			{/* <Button
				onClick={() => {
					queryClient.setQueryData(
						["fetch-latest-price"],
						(oldData: Record<string, LatestPrice>) => {
							if (!oldData) return {};
							return {
								...oldData,
								"30ecd396-e12e-4a75-90d5-5514400a9b65": {
									...oldData["30ecd396-e12e-4a75-90d5-5514400a9b65"],
									prices: [
										{
											price: "0.802827185864392779072036856655341177",
											title: "Bhutan",
											volume: 721
										},
										{
											price: "0.097172814135607220927963143344658826",
											title: "Brunei",
											volume: 0,
										},
									],
								},
							};
						},
					);

					console.log(
						queryClient.getQueryData(["fetch-latest-price"]),
					);
				}}
			>
				Update price
			</Button> */}
			<MarketCards />
		</div>
	);
}
