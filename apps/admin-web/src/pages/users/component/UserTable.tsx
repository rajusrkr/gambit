import { Badge } from "@/components/ui/badge";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { useUsers } from "../hooks/useUsers";
import type { Users } from "../page";
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
		label: "Balance",
		items: [
			{ value: "highest", title: "Highest" },
			{ value: "lowest", title: "Lowest" },
			{ value: "none", title: "None" },
		],
	},
	{
		label: "Profit",
		items: [
			{ value: "highest", title: "Highest" },
			{ value: "lowest", title: "Lowest" },
			{ value: "none", title: "None" },
		],
	},
	{
		label: "Turnover",
		items: [
			{ value: "highest", title: "Highest" },
			{ value: "lowest", title: "Lowest" },
			{ value: "none", title: "None" },
		],
	},
];

export default function UserTable({ users }: { users: Users[] }) {
	const { queryFilter, setFilter } = useMarketFilterStore();
	const { data } = useUsers({ queryFilter });
	console.log(data);

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

			<Table className="">
				<TableHeader>
					<TableRow>
						<TableHead>Count</TableHead>
						<TableHead>Name</TableHead>
						<TableHead>Email</TableHead>
						<TableHead className="hover:cursor-pointer">Balance</TableHead>
						<TableHead className="text-right">User Id</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{users.map((user, i) => (
						<TableRow key={user.userId}>
							<TableCell>{i + 1}</TableCell>
							<TableCell>{user.name}</TableCell>
							<TableCell>{user.email}</TableCell>
							<TableCell>{user.accountBalance}</TableCell>
							<TableCell className="text-right">{user.userId}</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</>
	);
}
