const BACKEND_URL = import.meta.env.VITE_API_URL;

// DATA ROUTES
const GET_MARKETS = `${BACKEND_URL}/market/data/markets`;
const GET_LATEST_PRICE = `${BACKEND_URL}/market/data/get-latest-price`;

// MARKET ROUTES
const FETCH_FOOTBALL = `${BACKEND_URL}/market/fetch-football`;
const CREATE_MARKET = `${BACKEND_URL}/market/create-market`;
const DELETE_MARKET = `${BACKEND_URL}/market/delete`;

export {
	BACKEND_URL,
	CREATE_MARKET,
	DELETE_MARKET,
	FETCH_FOOTBALL,
	GET_LATEST_PRICE,
	GET_MARKETS,
};
