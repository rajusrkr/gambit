const BACKEND_URL = import.meta.env.VITE_API_URL;

// DATA ROUTES
const GET_MARKETS = `${BACKEND_URL}/market/data/markets`;
const GET_LATEST_PRICE = `${BACKEND_URL}/market/data/get-latest-price`;

export { BACKEND_URL, GET_LATEST_PRICE, GET_MARKETS };


