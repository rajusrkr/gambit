import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Item, ItemContent, ItemTitle } from "@/components/ui/item";
import { usePositionByMarketId } from "../market-by-id/hooks/usePositionByMarketId";
import { useParams } from "react-router-dom";



export default function Position() {


const marketId = useParams().id

	const {data: positions, } = usePositionByMarketId({marketId: marketId!})


	return (
		<div>
			<Card className="max-w-2xl mx-auto">
				<CardHeader>
					<CardTitle>All positions</CardTitle>
					<CardDescription>
						All positions taken by you will appear here
					</CardDescription>
				</CardHeader>

				<CardContent>
					{positions?.length !== 0 ? (
						<div className="space-y-2">
							{positions?.map((position, i) => (
								<Dialog key={position.positionId}>
									<DialogTrigger className="w-full">
										<Item
											className="w-full flex justify-between hover:cursor-pointer hover:bg-accent"
											variant={"outline"}
										>
											<div className="text-left">
												<p className="text-xs dark:text-gray-400 text-gray-500">
													{`QTY: ${position.positionQty}`}
												</p>
												<p className="font-semibold">
													{`Market title: ${position.outcome}`}
												</p>
												<p className="text-xs dark:text-gray-400 text-gray-500">
													{`Selected outcome: ${position.outcome}`}
												</p>
											</div>

											<div className="sm:text-right text-left">
												<p className="text-xs dark:text-gray-400 text-gray-500">
													{`Avg Price: ${Math.floor(Number(position.avgPrice) * 100) / 100}`}
												</p>
												<p className="font-semibold">{`PNL: 200.30`}</p>
												<p className="space-x-2 text-xs dark:text-gray-400 text-gray-500">
													<span>Status: Open</span>
													<span>LTP: 21.50</span>
												</p>
											</div>
										</Item>
									</DialogTrigger>

									<DialogContent>
										<DialogHeader>
											<DialogTitle>Position details</DialogTitle>
										</DialogHeader>

										<div className="max-h-[50vh] no-scrollbar overflow-y-auto -mx-4 px-4">
											<Item variant={"outline"}>
												<ItemContent>
													<ItemTitle>
														<p className="font-semibold">
															Market: {positions[i].outcome}
														</p>
													</ItemTitle>

													<div className="text-gray-400">
														<p>
															{`Selected outcome: ${positions[i].outcome}`}
														</p>
														<p>
															Avg Price:{" "}
															{Math.floor(
																Number(positions[i].avgPrice) * 100,
															) / 100}
														</p>
														<p>QTY: {positions[i].positionQty}</p>
													</div>
													<div>
														<p className="font-semibold">PNL: 200.52</p>
													</div>
												</ItemContent>
											</Item>
										</div>
										<DialogFooter>
											<Input placeholder="Quantity" type="number" />
											<Button variant={"destructive"} className="w-24">
												Sell
											</Button>
										</DialogFooter>
									</DialogContent>
								</Dialog>
							))}
						</div>
					) : (
						<div className="flex justify-center h-70 items-center">
							<p>No positions yet</p>
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
