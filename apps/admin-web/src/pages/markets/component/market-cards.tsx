import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { toast } from "sonner";
import {
	IconCircleDashedX,
	IconDotsVertical,
	IconEdit,
	IconExternalLink,
	IconLoader2,
	IconTrash,
} from "@tabler/icons-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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
import {
	Item,
	ItemContent,
	ItemDescription,
	ItemMedia,
	ItemTitle,
} from "@/components/ui/item";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMarket } from "../hooks/useMarket";
import type { MARKET_CATEGORY, MARKET_STATUS } from "../types";
import { useMarketFilters } from "../zustand-store";

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
	const {
		marketCategory: category,
		marketStatus: status,
		setMarketCategory,
		setMarketStatus,
	} = useMarketFilters();
	const { markets, fetchNextPage, isFetchingNextPage, isLoading } = useMarket({
		category: category,
		limit: "21",
		status: status,
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

	return (
		<>
			<div className="sm:flex sm:justify-between grid">
				<div className="mb-4">
					<Badge>Category</Badge>
					<Tabs
						defaultValue={category}
						onValueChange={(e) => {
							setMarketCategory({ category: e as MARKET_CATEGORY });
						}}
					>
						<TabsList variant={"line"}>
							<TabsTrigger value="all">All</TabsTrigger>
							<TabsTrigger value="sports">Sports</TabsTrigger>
							<TabsTrigger value="crypto">Crypto</TabsTrigger>
							<TabsTrigger value="weather">Weather</TabsTrigger>
						</TabsList>
					</Tabs>
				</div>

				<div className="mb-4 overflow-hidden">
					<Badge>Status</Badge>
					<div className="relative">
						<Tabs
							defaultValue={status}
							onValueChange={(e) => {
								setMarketStatus({ status: e as MARKET_STATUS });
							}}
						>
							<div
								className="w-full overflow-x-auto overflow-y-hidden scroll-smooth"
								style={{
									scrollbarWidth: "none",
									WebkitOverflowScrolling: "touch",
								}}
							>
								<TabsList variant="line">
									<TabsTrigger value="all" className="shrink-0">
										All
									</TabsTrigger>
									<TabsTrigger value="open" className="shrink-0">
										Open
									</TabsTrigger>
									<TabsTrigger value="settled" className="shrink-0">
										Settled
									</TabsTrigger>
									<TabsTrigger value="new_order_paused" className="shrink-0">
										New order paused
									</TabsTrigger>
									<TabsTrigger value="open_soon" className="shrink-0">
										Open soon
									</TabsTrigger>
									<TabsTrigger value="canceled" className="shrink-0">
										Canceled
									</TabsTrigger>
								</TabsList>
							</div>
						</Tabs>
					</div>
				</div>
			</div>

			{isLoading ? (
				<div className="flex justify-center items-center h-[70vh]">
					<IconLoader2 className="animate-spin" />
				</div>
			) : !markets || markets.length === 0 ? (
				<div>
					<div className="flex justify-center items-center h-[70vh] max-w-96 mx-auto">
						<Item variant="outline">
							<ItemMedia variant="icon">
								<IconCircleDashedX />
							</ItemMedia>
							<ItemContent>
								<ItemTitle>No markets available</ItemTitle>
								<ItemDescription>
									There are no open markets available for the selected filter,
									please try again later.
								</ItemDescription>
							</ItemContent>
						</Item>
					</div>
				</div>
			) : (
				<div>
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
											<p className="font-semibold mb-0.5 text-gray-500">
												Outcomes
											</p>
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
															onSelect={(event: {
																preventDefault: () => void;
															}) => {
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
																			permanently delete this market from our
																			servers.
																		</AlertDialogDescription>
																	</AlertDialogHeader>
																	<AlertDialogFooter>
																		<AlertDialogCancel>
																			Cancel
																		</AlertDialogCancel>
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
					</div>
					<div
						ref={ref}
						className="flex justify-center pt-1 font-semibold text-gray-500"
					>
						{inView && isFetchingNextPage && (
							<span className="flex items-center">
								Loading more...
								<IconLoader2 className="animate-spin text-gray-500 size-4.5" />
							</span>
						)}
					</div>
				</div>
			)}
		</>
	);
}
