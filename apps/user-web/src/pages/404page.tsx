import { Link } from "react-router-dom";

export default function PageNotFound() {
  return (
    <div className="flex justify-center items-center flex-col h-[70vh]">
      <h1 className="text-4xl font-semibold">404</h1>
      <h2>Page doesn&apos;t exits</h2>
      <Link to={"/"}>
        <span className="text-primary underline-offset-1 underline">
          Back to home
        </span>
      </Link>
    </div>
  );
}
