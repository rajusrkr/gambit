import { useMarket } from "../hooks/useMarket";

export default function Market() {
	const { data, isLoading } = useMarket({
		category: "all",
		status: "all",
		limit: "3",
	});

	console.log(isLoading, data);

	return <div className="p-4">market page</div>;
}
