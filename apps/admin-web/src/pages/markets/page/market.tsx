// const formData = [
// 	{
// 		category: "crypto",
// 		cryptoName: "HYPE_USDC",
// 		description:
// 			"This market will resolve to the final closeing price of HYPE_USDC in backpack 5 minute candle that forms between 11:55PM-12:00AM on 20th April",
// 		interval: "5m",
// 		marketEnds: Math.floor(Date.now() / 1000) + 5 * 24 * 60 * 60,
// 		marketStarts: Math.floor(Date.now() / 1000) + 60,
// 		outcomes: ["$45", "$50", "$55", "$60"],
// 		settlementRules:
// 			"If the 5 minute candle give closing above any outcomes that will be declared as winner other wise the market will be draw, and all money will be sent back to users",
// 		title: "What will be the price of HYPE_USDC at the end 20th April?",
// 	},
// 	{
// 		category: "crypto",
// 		cryptoName: "BNB_USDC",
// 		description:
// 			"This market will resolve to the final closeing price of BNB_USDC in backpack 5 minute candle that forms between 11:55PM-12:00AM on 20th April",
// 		interval: "5m",
// 		marketEnds: Math.floor(Date.now() / 1000) + 5 * 24 * 60 * 60,
// 		marketStarts: Math.floor(Date.now() / 1000) + 60,
// 		outcomes: ["$605", "$610", "$615", "$620"],
// 		settlementRules:
// 			"If the 5 minute candle give closing above any outcomes that will be declared as winner other wise the market will be draw, and all money will be sent back to users",
// 		title: "What will be the price of BNB_USDC at the end 20th April?",
// 	},
// 	{
// 		category: "crypto",
// 		cryptoName: "SOL_USDC",
// 		description:
// 			"This market will resolve to the final closeing price of SOL_USDC in backpack 5 minute candle that forms between 11:55PM-12:00AM on 20th April",
// 		interval: "5m",
// 		marketEnds: Math.floor(Date.now() / 1000) + 5 * 24 * 60 * 60,
// 		marketStarts: Math.floor(Date.now() / 1000) + 60,
// 		outcomes: ["$75", "$80", "$85", "$90"],
// 		settlementRules:
// 			"If the 5 minute candle give closing above any outcomes that will be declared as winner other wise the market will be draw, and all money will be sent back to users",
// 		title: "What will be the price of SOL_USDC at the end 20th April?",
// 	},
// 	{
// 		category: "crypto",
// 		cryptoName: "POL_USDC",
// 		description:
// 			"This market will resolve to the final closeing price of POL_USDC in backpack 5 minute candle that forms between 11:55PM-12:00AM on 20th April",
// 		interval: "5m",
// 		marketEnds: Math.floor(Date.now() / 1000) + 5 * 24 * 60 * 60,
// 		marketStarts: Math.floor(Date.now() / 1000) + 60,
// 		outcomes: ["$0.85", "$0.90", "$0.95", "$1"],
// 		settlementRules:
// 			"If the 5 minute candle give closing above any outcomes that will be declared as winner other wise the market will be draw, and all money will be sent back to users",
// 		title: "What will be the price of POL_USDC at the end 20th April?",
// 	},
// 	{
// 		title: "Guastatoya vs Antigua GFC",
// 		description: "This is a match between Guastatoya and Antigua GFC",
// 		category: "sports",
// 		settlementRules:
// 			"At the end of the market the winner will be fetched from sports api, if there is no winner due to internal problems the market will resolve to draw and all money will be sent back to users.",
// 		match: "Guastatoya vs Antigua GFC",
// 		marketEnds: 1776297600 + 2 * 60 * 60,
// 		marketStarts: Math.floor(Date.now() / 1000) + 60,
// 		matchEnds: 1776297600 + 1.5 * 60 * 60,
// 		matchStarts: 1776297600,
// 		matchId: "1499235",
// 		outcomes: ["Guastatoya", "Antigua GFC"],
// 	},
// 	{
// 		title: "San Antonio vs Deportivo Cuenca Juniors",
// 		description:
// 			"This is a match between San Antonio and Deportivo Cuenca Juniors",
// 		category: "sports",
// 		settlementRules:
// 			"At the end of the market the winner will be fetched from sports api, if there is no winner due to internal problems the market will resolve to draw and all money will be sent back to users.",
// 		match: "San Antonio vs Deportivo Cuenca Juniors",
// 		marketEnds: 1776297600 + 2 * 60 * 60,
// 		marketStarts: Math.floor(Date.now() / 1000) + 60,
// 		matchEnds: 1776297600 + 1.5 * 60 * 60,
// 		matchStarts: 1776297600,
// 		matchId: "1499235",
// 		outcomes: ["San Antonio", "Deportivo Cuenca Juniors"],
// 	},
// 	{
// 		title: "Olimpia vs Barracas Central",
// 		description: "This is a match between Olimpia and Barracas Central",
// 		category: "sports",
// 		settlementRules:
// 			"At the end of the market the winner will be fetched from sports api, if there is no winner due to internal problems the market will resolve to draw and all money will be sent back to users.",
// 		match: "Olimpia vs Barracas Central",
// 		marketEnds: 1776297600 + 2 * 60 * 60,
// 		marketStarts: Math.floor(Date.now() / 1000) + 60,
// 		matchEnds: 1776297600 + 1.5 * 60 * 60,
// 		matchStarts: 1776297600,
// 		matchId: "1499235",
// 		outcomes: ["Olimpia", "Barracas Central"],
// 	},

// 	// Duplicate entries
// 	{
// 		title: "Guastatoya vs Antigua GFC",
// 		description: "This is a match between Guastatoya and Antigua GFC",
// 		category: "sports",
// 		settlementRules:
// 			"At the end of the market the winner will be fetched from sports api, if there is no winner due to internal problems the market will resolve to draw and all money will be sent back to users.",
// 		match: "Guastatoya vs Antigua GFC",
// 		marketEnds: 1776297600 + 2 * 60 * 60,
// 		marketStarts: Math.floor(Date.now() / 1000) + 60,
// 		matchEnds: 1776297600 + 1.5 * 60 * 60,
// 		matchStarts: 1776297600,
// 		matchId: "1499235",
// 		outcomes: ["Guastatoya", "Antigua GFC"],
// 	},
// 	{
// 		title: "San Antonio vs Deportivo Cuenca Juniors",
// 		description:
// 			"This is a match between San Antonio and Deportivo Cuenca Juniors",
// 		category: "sports",
// 		settlementRules:
// 			"At the end of the market the winner will be fetched from sports api, if there is no winner due to internal problems the market will resolve to draw and all money will be sent back to users.",
// 		match: "San Antonio vs Deportivo Cuenca Juniors",
// 		marketEnds: 1776297600 + 2 * 60 * 60,
// 		marketStarts: Math.floor(Date.now() / 1000) + 60,
// 		matchEnds: 1776297600 + 1.5 * 60 * 60,
// 		matchStarts: 1776297600,
// 		matchId: "1499235",
// 		outcomes: ["San Antonio", "Deportivo Cuenca Juniors"],
// 	},
// 	{
// 		title: "Olimpia vs Barracas Central",
// 		description: "This is a match between Olimpia and Barracas Central",
// 		category: "sports",
// 		settlementRules:
// 			"At the end of the market the winner will be fetched from sports api, if there is no winner due to internal problems the market will resolve to draw and all money will be sent back to users.",
// 		match: "Olimpia vs Barracas Central",
// 		marketEnds: 1776297600 + 2 * 60 * 60,
// 		marketStarts: Math.floor(Date.now() / 1000) + 60,
// 		matchEnds: 1776297600 + 1.5 * 60 * 60,
// 		matchStarts: 1776297600,
// 		matchId: "1499235",
// 		outcomes: ["Olimpia", "Barracas Central"],
// 	},

// 	{
// 		title: "Guastatoya vs Antigua GFC",
// 		description: "This is a match between Guastatoya and Antigua GFC",
// 		category: "sports",
// 		settlementRules:
// 			"At the end of the market the winner will be fetched from sports api, if there is no winner due to internal problems the market will resolve to draw and all money will be sent back to users.",
// 		match: "Guastatoya vs Antigua GFC",
// 		marketEnds: 1776297600 + 2 * 60 * 60,
// 		marketStarts: Math.floor(Date.now() / 1000) + 60,
// 		matchEnds: 1776297600 + 1.5 * 60 * 60,
// 		matchStarts: 1776297600,
// 		matchId: "1499235",
// 		outcomes: ["Guastatoya", "Antigua GFC"],
// 	},
// 	{
// 		title: "San Antonio vs Deportivo Cuenca Juniors",
// 		description:
// 			"This is a match between San Antonio and Deportivo Cuenca Juniors",
// 		category: "sports",
// 		settlementRules:
// 			"At the end of the market the winner will be fetched from sports api, if there is no winner due to internal problems the market will resolve to draw and all money will be sent back to users.",
// 		match: "San Antonio vs Deportivo Cuenca Juniors",
// 		marketEnds: 1776297600 + 2 * 60 * 60,
// 		marketStarts: Math.floor(Date.now() / 1000) + 60,
// 		matchEnds: 1776297600 + 1.5 * 60 * 60,
// 		matchStarts: 1776297600,
// 		matchId: "1499235",
// 		outcomes: ["San Antonio", "Deportivo Cuenca Juniors"],
// 	},
// 	{
// 		title: "Olimpia vs Barracas Central",
// 		description: "This is a match between Olimpia and Barracas Central",
// 		category: "sports",
// 		settlementRules:
// 			"At the end of the market the winner will be fetched from sports api, if there is no winner due to internal problems the market will resolve to draw and all money will be sent back to users.",
// 		match: "Olimpia vs Barracas Central",
// 		marketEnds: 1776297600 + 2 * 60 * 60,
// 		marketStarts: Math.floor(Date.now() / 1000) + 60,
// 		matchEnds: 1776297600 + 1.5 * 60 * 60,
// 		matchStarts: 1776297600,
// 		matchId: "1499235",
// 		outcomes: ["Olimpia", "Barracas Central"],
// 	},

// 	{
// 		title: "Guastatoya vs Antigua GFC",
// 		description: "This is a match between Guastatoya and Antigua GFC",
// 		category: "sports",
// 		settlementRules:
// 			"At the end of the market the winner will be fetched from sports api, if there is no winner due to internal problems the market will resolve to draw and all money will be sent back to users.",
// 		match: "Guastatoya vs Antigua GFC",
// 		marketEnds: 1776297600 + 2 * 60 * 60,
// 		marketStarts: Math.floor(Date.now() / 1000) + 60,
// 		matchEnds: 1776297600 + 1.5 * 60 * 60,
// 		matchStarts: 1776297600,
// 		matchId: "1499235",
// 		outcomes: ["Guastatoya", "Antigua GFC"],
// 	},
// 	{
// 		title: "San Antonio vs Deportivo Cuenca Juniors",
// 		description:
// 			"This is a match between San Antonio and Deportivo Cuenca Juniors",
// 		category: "sports",
// 		settlementRules:
// 			"At the end of the market the winner will be fetched from sports api, if there is no winner due to internal problems the market will resolve to draw and all money will be sent back to users.",
// 		match: "San Antonio vs Deportivo Cuenca Juniors",
// 		marketEnds: 1776297600 + 2 * 60 * 60,
// 		marketStarts: Math.floor(Date.now() / 1000) + 60,
// 		matchEnds: 1776297600 + 1.5 * 60 * 60,
// 		matchStarts: 1776297600,
// 		matchId: "1499235",
// 		outcomes: ["San Antonio", "Deportivo Cuenca Juniors"],
// 	},
// 	{
// 		title: "Olimpia vs Barracas Central",
// 		description: "This is a match between Olimpia and Barracas Central",
// 		category: "sports",
// 		settlementRules:
// 			"At the end of the market the winner will be fetched from sports api, if there is no winner due to internal problems the market will resolve to draw and all money will be sent back to users.",
// 		match: "Olimpia vs Barracas Central",
// 		marketEnds: 1776297600 + 2 * 60 * 60,
// 		marketStarts: Math.floor(Date.now() / 1000) + 60,
// 		matchEnds: 1776297600 + 1.5 * 60 * 60,
// 		matchStarts: 1776297600,
// 		matchId: "1499235",
// 		outcomes: ["Olimpia", "Barracas Central"],
// 	},

// 	{
// 		title: "Guastatoya vs Antigua GFC",
// 		description: "This is a match between Guastatoya and Antigua GFC",
// 		category: "sports",
// 		settlementRules:
// 			"At the end of the market the winner will be fetched from sports api, if there is no winner due to internal problems the market will resolve to draw and all money will be sent back to users.",
// 		match: "Guastatoya vs Antigua GFC",
// 		marketEnds: 1776297600 + 2 * 60 * 60,
// 		marketStarts: Math.floor(Date.now() / 1000) + 60,
// 		matchEnds: 1776297600 + 1.5 * 60 * 60,
// 		matchStarts: 1776297600,
// 		matchId: "1499235",
// 		outcomes: ["Guastatoya", "Antigua GFC"],
// 	},
// 	{
// 		title: "San Antonio vs Deportivo Cuenca Juniors",
// 		description:
// 			"This is a match between San Antonio and Deportivo Cuenca Juniors",
// 		category: "sports",
// 		settlementRules:
// 			"At the end of the market the winner will be fetched from sports api, if there is no winner due to internal problems the market will resolve to draw and all money will be sent back to users.",
// 		match: "San Antonio vs Deportivo Cuenca Juniors",
// 		marketEnds: 1776297600 + 2 * 60 * 60,
// 		marketStarts: Math.floor(Date.now() / 1000) + 60,
// 		matchEnds: 1776297600 + 1.5 * 60 * 60,
// 		matchStarts: 1776297600,
// 		matchId: "1499235",
// 		outcomes: ["San Antonio", "Deportivo Cuenca Juniors"],
// 	},
// 	{
// 		title: "Olimpia vs Barracas Central",
// 		description: "This is a match between Olimpia and Barracas Central",
// 		category: "sports",
// 		settlementRules:
// 			"At the end of the market the winner will be fetched from sports api, if there is no winner due to internal problems the market will resolve to draw and all money will be sent back to users.",
// 		match: "Olimpia vs Barracas Central",
// 		marketEnds: 1776297600 + 2 * 60 * 60,
// 		marketStarts: Math.floor(Date.now() / 1000) + 60,
// 		matchEnds: 1776297600 + 1.5 * 60 * 60,
// 		matchStarts: 1776297600,
// 		matchId: "1499235",
// 		outcomes: ["Olimpia", "Barracas Central"],
// 	},

// 	{
// 		title: "Guastatoya vs Antigua GFC",
// 		description: "This is a match between Guastatoya and Antigua GFC",
// 		category: "sports",
// 		settlementRules:
// 			"At the end of the market the winner will be fetched from sports api, if there is no winner due to internal problems the market will resolve to draw and all money will be sent back to users.",
// 		match: "Guastatoya vs Antigua GFC",
// 		marketEnds: 1776297600 + 2 * 60 * 60,
// 		marketStarts: Math.floor(Date.now() / 1000) + 60,
// 		matchEnds: 1776297600 + 1.5 * 60 * 60,
// 		matchStarts: 1776297600,
// 		matchId: "1499235",
// 		outcomes: ["Guastatoya", "Antigua GFC"],
// 	},
// 	{
// 		title: "San Antonio vs Deportivo Cuenca Juniors",
// 		description:
// 			"This is a match between San Antonio and Deportivo Cuenca Juniors",
// 		category: "sports",
// 		settlementRules:
// 			"At the end of the market the winner will be fetched from sports api, if there is no winner due to internal problems the market will resolve to draw and all money will be sent back to users.",
// 		match: "San Antonio vs Deportivo Cuenca Juniors",
// 		marketEnds: 1776297600 + 2 * 60 * 60,
// 		marketStarts: Math.floor(Date.now() / 1000) + 60,
// 		matchEnds: 1776297600 + 1.5 * 60 * 60,
// 		matchStarts: 1776297600,
// 		matchId: "1499235",
// 		outcomes: ["San Antonio", "Deportivo Cuenca Juniors"],
// 	},
// 	{
// 		title: "Olimpia vs Barracas Central",
// 		description: "This is a match between Olimpia and Barracas Central",
// 		category: "sports",
// 		settlementRules:
// 			"At the end of the market the winner will be fetched from sports api, if there is no winner due to internal problems the market will resolve to draw and all money will be sent back to users.",
// 		match: "Olimpia vs Barracas Central",
// 		marketEnds: 1776297600 + 2 * 60 * 60,
// 		marketStarts: Math.floor(Date.now() / 1000) + 60,
// 		matchEnds: 1776297600 + 1.5 * 60 * 60,
// 		matchStarts: 1776297600,
// 		matchId: "1499235",
// 		outcomes: ["Olimpia", "Barracas Central"],
// 	},

// 	{
// 		title: "Guastatoya vs Antigua GFC",
// 		description: "This is a match between Guastatoya and Antigua GFC",
// 		category: "sports",
// 		settlementRules:
// 			"At the end of the market the winner will be fetched from sports api, if there is no winner due to internal problems the market will resolve to draw and all money will be sent back to users.",
// 		match: "Guastatoya vs Antigua GFC",
// 		marketEnds: 1776297600 + 2 * 60 * 60,
// 		marketStarts: Math.floor(Date.now() / 1000) + 60,
// 		matchEnds: 1776297600 + 1.5 * 60 * 60,
// 		matchStarts: 1776297600,
// 		matchId: "1499235",
// 		outcomes: ["Guastatoya", "Antigua GFC"],
// 	},
// 	{
// 		title: "San Antonio vs Deportivo Cuenca Juniors",
// 		description:
// 			"This is a match between San Antonio and Deportivo Cuenca Juniors",
// 		category: "sports",
// 		settlementRules:
// 			"At the end of the market the winner will be fetched from sports api, if there is no winner due to internal problems the market will resolve to draw and all money will be sent back to users.",
// 		match: "San Antonio vs Deportivo Cuenca Juniors",
// 		marketEnds: 1776297600 + 2 * 60 * 60,
// 		marketStarts: Math.floor(Date.now() / 1000) + 60,
// 		matchEnds: 1776297600 + 1.5 * 60 * 60,
// 		matchStarts: 1776297600,
// 		matchId: "1499235",
// 		outcomes: ["San Antonio", "Deportivo Cuenca Juniors"],
// 	},
// 	{
// 		title: "Olimpia vs Barracas Central",
// 		description: "This is a match between Olimpia and Barracas Central",
// 		category: "sports",
// 		settlementRules:
// 			"At the end of the market the winner will be fetched from sports api, if there is no winner due to internal problems the market will resolve to draw and all money will be sent back to users.",
// 		match: "Olimpia vs Barracas Central",
// 		marketEnds: 1776297600 + 2 * 60 * 60,
// 		marketStarts: Math.floor(Date.now() / 1000) + 60,
// 		matchEnds: 1776297600 + 1.5 * 60 * 60,
// 		matchStarts: 1776297600,
// 		matchId: "1499235",
// 		outcomes: ["Olimpia", "Barracas Central"],
// 	},
// ];

export default function Market() {


	return (
		<div className="p-4">
			<div>
				<h3 className="text-2xl font-semibold pb-4">Markets</h3>
			</div>
			{/* <MarketCards data={data as MarketData[]} isLoading={isLoading} /> */}
			hey there
		</div>
	);
}
