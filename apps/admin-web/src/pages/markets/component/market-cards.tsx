import {
	IconDotsVertical,
	IconEdit,
	IconExternalLink,
	IconLoader2,
	IconTrash,
} from "@tabler/icons-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { toast } from "sonner";
import { deleteMarket } from "@/api/market";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useMarket } from "../hooks/useMarket";

const marketCategory = [
	{ key: "crypto", value: "Crypto" },
	{ key: "sports", value: "Sports" },
	{ key: "weather", value: "Weather" },
];

const marketStatus = [
	{ key: "open", value: "Open" },
	{ key: "settled", value: "Settled" },
	{ key: "new_order_paused", value: "New order paused" },
	{ key: "open_soon", value: "Open soon" },
	{ key: "canceled", value: "Canceled" },
];

export default function MarketCards() {
	const { markets, fetchNextPage, isFetchingNextPage, isLoading } = useMarket({
		category: "all",
		limit: "21",
		status: "all",
	});

	const { ref, inView } = useInView();
	useEffect(() => {
		if (inView) {
			fetchNextPage();
		}
	}, [fetchNextPage, inView]);

	const queryClient = useQueryClient();
	const deleteMutate = useMutation({
		mutationKey: ["delete-market"],
		mutationFn: (marketId: string) => deleteMarket({ marketId }),
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: ["markets"] });
			toast.success(data, { position: "top-right" });
		},
	});

	if (isLoading) {
		return <div>Loading...</div>;
	}

	return (
		<div className="grid sm:grid-cols-3 grid-cols-1 gap-1.5">
			{markets?.length === 0 ? (
				<div>
					<p>No markets to show</p>
				</div>
			) : (
				markets?.map((market) => (
					<Card
						key={market.marketId}
						className="relative flex flex-col justify-between"
					>
						<CardHeader>
							<CardTitle>{market.marketTitle}</CardTitle>
							<CardDescription className="space-x-2">
								<Badge variant={"secondary"} className="select-none">
									{
										marketCategory.find(
											(ctgry) => ctgry.key === market.marketCategory,
										)?.value
									}
								</Badge>
								<Badge variant={"secondary"} className="select-none">
									{
										marketStatus.find(
											(status) => status.key === market.marketStatus,
										)?.value
									}
								</Badge>
							</CardDescription>
						</CardHeader>

						<CardContent className="flex-1 flex flex-col justify-between">
							<div className="mb-2 space-x-2">
								<p className="font-semibold mb-0.5 text-gray-500">Outcomes</p>
								{market.outcomes.map((outcome) => (
									<Badge
										variant={"outline"}
										key={outcome.title}
										className="select-none"
									>
										{outcome.title}
									</Badge>
								))}
							</div>

							<div className="flex justify-end -ml-2 -mb-2">
								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<Button variant="ghost">
											<IconDotsVertical />
										</Button>
									</DropdownMenuTrigger>
									<DropdownMenuContent className="w-40" align="start">
										<DropdownMenuGroup>
											<DropdownMenuLabel>Actions</DropdownMenuLabel>
										</DropdownMenuGroup>
										<DropdownMenuSeparator />
										<DropdownMenuGroup>
											<DropdownMenuItem>
												View
												<IconExternalLink />
											</DropdownMenuItem>
											<DropdownMenuItem>
												Edit
												<IconEdit />
											</DropdownMenuItem>
											<DropdownMenuItem
												variant={"destructive"}
												onSelect={(event: { preventDefault: () => void }) => {
													event.preventDefault();
												}}
											>
												<AlertDialog>
													<AlertDialogTrigger asChild>
														<p className="flex gap-1 items-center w-full">
															Delete
															<IconTrash />
														</p>
													</AlertDialogTrigger>
													<AlertDialogContent>
														<AlertDialogHeader>
															<AlertDialogTitle>
																Are sure that you want to delete?
															</AlertDialogTitle>
															<AlertDialogDescription>
																This action cannot be undone. This will
																permanently delete this market from our servers.
															</AlertDialogDescription>
														</AlertDialogHeader>
														<AlertDialogFooter>
															<AlertDialogCancel>Cancel</AlertDialogCancel>
															<AlertDialogAction
																variant={"destructive"}
																onClick={async (e: {
																	preventDefault: () => void;
																}) => {
																	e.preventDefault();
																	deleteMutate.mutate(market.marketId);
																}}
															>
																{deleteMutate.isPending ? (
																	<span className="flex gap-1 items-center">
																		Delete{" "}
																		<IconLoader2 className="animate-spin size-3" />
																	</span>
																) : (
																	"Delete"
																)}
															</AlertDialogAction>
														</AlertDialogFooter>
													</AlertDialogContent>
												</AlertDialog>
											</DropdownMenuItem>
										</DropdownMenuGroup>
									</DropdownMenuContent>
								</DropdownMenu>
							</div>
						</CardContent>
					</Card>
				))
			)}

			<div ref={ref}>{isFetchingNextPage && "Loading more..."}</div>
		</div>
	);
}
