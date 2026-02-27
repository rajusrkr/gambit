import { Button } from "@/components/ui/button";

export default function Market() {
  return (
    <div className="p-10 space-x-1">
      <Button className="w-20">Buy</Button>
      <Button className="w-20" variant={"destructive"}>
        Sell
      </Button>
    </div>
  );
}
