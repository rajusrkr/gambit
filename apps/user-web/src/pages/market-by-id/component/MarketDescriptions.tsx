export default function MarketDescriptions({
  description,
  settlementRules,
}: {
  description: string;
  settlementRules: string;
}) {
  return (
    <div className="pb-2">
      <h2 className="font-semibold">Description</h2>
      <p className="text-sm text-gray-500 max-w-4xl">{description}</p>
      <h2 className="font-semibold mt-2">Settlement Rules</h2>
      <p className="text-sm text-gray-500 max-w-4xl">{settlementRules}</p>
    </div>
  );
}
