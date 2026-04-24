import {
	IconDotsVertical,
	IconEdit,
	IconExternalLink,
	IconLoader2,
	IconTrash,
} from "@tabler/icons-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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
import type { MarketData } from "../types/market";

export default function MarketCards({
	data,
	isLoading,
}: {
	data: MarketData[];
	isLoading: boolean;
}) {
	const queryClient = useQueryClient();	

	const deleteMutate = useMutation({
		mutationKey: ["delete-market"],
		mutationFn: (marketId: string) => deleteMarket({ marketId }),
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: ["fetch-markets"] });
			toast.success(data, { position: "top-right" });
		},
	});

	if (isLoading) {
		return <div>Loading...</div>;
	}
	return (
		<div className="grid sm:grid-cols-3 grid-cols-1 gap-1.5">
			{data.length === 0 ? (
				<div>
					<p>No markets to show</p>
				</div>
			) : (
				data.map((market) => (
					<Card
						key={market.marketId}
						className="relative flex flex-col justify-between"
					>
						<CardHeader>
							<CardTitle>{market.marketTitle}</CardTitle>
							<CardDescription>{`${market.marketCategory}, ${market.marketStatus}`}</CardDescription>
						</CardHeader>

						<CardContent className="flex-1 flex flex-col justify-between">
							<div className="mb-4">
								{market.outcomes.map((outcome) => (
									<p key={outcome.title}>{outcome.title}</p>
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
		</div>
	);
}
