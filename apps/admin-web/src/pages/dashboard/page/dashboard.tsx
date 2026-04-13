import AllMarketCards from "../component/all-market-cards";

export default function Dashboard() {
	return (
		<div className="p-4">
			<div>
				<h3 className="text-2xl font-semibold pb-4">Markets</h3>
			</div>
			<AllMarketCards />
		</div>
	);
}
