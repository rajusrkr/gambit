import { Link } from "react-router";

export default function PageNotFound() {
	return (
		<div className="flex justify-center items-center h-[60vh] flex-col">
			<p className="text-3xl font-semibold">
				The page you are looking for does not exists
			</p>
			<Link to={"/"}>
				<span className="underline text-blue-500">Go back to home</span>
			</Link>
		</div>
	);
}
