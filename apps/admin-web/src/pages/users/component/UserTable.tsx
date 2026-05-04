import { useEffect } from "react";
import { Link } from "react-router";
import { useInView } from "react-intersection-observer";
import {
	IconArrowNarrowDownDashed,
	IconArrowNarrowUpDashed,
	IconLoader2,
} from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import UserDialogContent from "./UserDialogContent";
import { useUsers } from "../hooks/useUsers";
import type { FilterLabel, Filters } from "../zustand-store";
import { useMarketFilterStore } from "../zustand-store";

interface UserQueryFilter {
	label: FilterLabel;
	items: {
		title: string;
		value: Filters;
	}[];
}

const userFilter: UserQueryFilter[] = [
	{
		label: "Registered",
		items: [
			{ value: "latest", title: "Latest" },
			{ value: "oldest", title: "Oldest" },
			{ value: "none", title: "None" },
		],
	},
	{
		label: "Wallet Balance",
		items: [
			{ value: "highest", title: "Highest" },
			{ value: "lowest", title: "Lowest" },
			{ value: "none", title: "None" },
		],
	},
];

export default function UserTable() {
	const { queryFilter, setFilter } = useMarketFilterStore();
	const {
		data,
		errorMessage,
		isError,
		isLoading,
		fetchNextPage,
		isFethchingNextPage,
		totalUser,
		userShowing,
	} = useUsers({
		queryFilter,
	});

	const { ref, inView } = useInView();

	useEffect(() => {
		if (inView) {
			fetchNextPage();
		}
	}, [inView, fetchNextPage]);

	return (
		<>
			<div className="pt-2">
				<div>
					<p className="text-lg font-semibold">Filters</p>
				</div>
				<div className="flex gap-2">
					{userFilter.map((filter) => (
						<div key={filter.label}>
							<p className="font-semibold text-gray-500 text-sm">
								{filter.label}
							</p>

							<div>
								{filter.items.map((item) => (
									<div key={item.title}>
										<Badge
											onClick={() => {
												setFilter({
													label: filter.label,
													value: item.value,
												});
											}}
											className="w-14 hover:cursor-pointer"
											variant={
												filter.label === queryFilter.label &&
												item.value === queryFilter.value
													? "default"
													: "outline"
											}
										>
											{item.title}
										</Badge>
									</div>
								))}
							</div>
						</div>
					))}
				</div>
			</div>

			{isLoading ? (
				<div className="flex justify-center items-center h-[40vh]">
					<IconLoader2 className="animate-spin text-gray-500" />
				</div>
			) : isError ? (
				<div className="flex justify-center items-center h-[40vh] font-semibold text-gray-500">
					{errorMessage?.message}
				</div>
			) : (
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Count</TableHead>
							<TableHead>
								<span className="flex items-center">
									Registered{" "}
									{queryFilter.value === "latest" ? (
										<IconArrowNarrowDownDashed className="size-4.5" />
									) : queryFilter.value === "oldest" ? (
										<IconArrowNarrowUpDashed className="size-4.5" />
									) : (
										""
									)}
								</span>
							</TableHead>
							<TableHead>Name</TableHead>
							<TableHead>Email</TableHead>
							<TableHead>
								<span className="flex items-center">
									Wallet balance{" "}
									{queryFilter.value === "highest" ? (
										<IconArrowNarrowDownDashed className="size-4.5" />
									) : queryFilter.value === "lowest" ? (
										<IconArrowNarrowUpDashed className="size-4.5" />
									) : (
										""
									)}
								</span>
							</TableHead>
							<TableHead className="text-right">User Id</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{data?.map((user, i) => (
							<Dialog key={user.userId}>
								<DialogTrigger asChild>
									<TableRow
										onClick={() => {
											// console.log(user);
										}}
										className="hover:cursor-pointer"
									>
										<TableCell>{i + 1}</TableCell>
										<TableCell>
											{new Date(user.registeredOn).toDateString()}
										</TableCell>
										<TableCell>{user.name}</TableCell>
										<TableCell>{user.email}</TableCell>
										<TableCell>
											${Math.floor(Number(user.balance) * 100) / 100}
										</TableCell>
										<TableCell className="text-right">{user.userId}</TableCell>
									</TableRow>
								</DialogTrigger>
								<DialogContent className="sm:max-w-sm">
									<DialogHeader>
										<DialogTitle>Edit profile</DialogTitle>
										<DialogDescription>
											Make changes to your profile here. Click save when
											you&apos;re done.
										</DialogDescription>
									</DialogHeader>
									<div className="overflow-y-auto max-h-[50vh] no-scrollbar">
										<UserDialogContent userId={user.userId} />
									</div>
									<DialogFooter>
										<Link to={`/users/${user.userId}`}>
											<Button className="hover:cursor-pointer">
												More details
											</Button>
										</Link>
										<DialogClose asChild>
											<Button variant="outline">Close</Button>
										</DialogClose>
									</DialogFooter>
								</DialogContent>
							</Dialog>
						))}

						<TableRow>
							<TableCell colSpan={6} className="text-center py-4">
								Total users: {totalUser}, showing: {userShowing}
							</TableCell>
						</TableRow>

						<TableRow>
							<TableCell colSpan={6} ref={ref} className="text-center py-4">
								{isFethchingNextPage && "Loading more users..."}
							</TableCell>
						</TableRow>
					</TableBody>
				</Table>
			)}
		</>
	);
}
