import MarketCards from "./component/market-cards";

/**
 * Default home page. The user will land this page after login. The markets will be shown here as cards.
 */
export default function Market() {
	return (
		<div>
			<MarketCards />
		</div>
	);
}
