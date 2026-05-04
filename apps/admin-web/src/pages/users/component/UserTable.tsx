import { useInView } from "react-intersection-observer";
import { useEffect } from "react";
import { BACKEND_URL } from "@/config/constants";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	IconArrowNarrowDownDashed,
	IconArrowNarrowUpDashed,
	IconLoader2,
} from "@tabler/icons-react";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { useUsers } from "../hooks/useUsers";
import type { FilterLabel, Filters } from "../zustand-store";
import { useMarketFilterStore } from "../zustand-store";
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
import UserDialogContent from "./UserDialogContent";
import { Link } from "react-router";

const userData = [
	{ name: "Aarav Sharma", email: "aarav.sharma1@gmail.com" },
	{ name: "Vivaan Patel", email: "vivaan.patel2@yahoo.com" },
	{ name: "Aditya Verma", email: "aditya.verma3@outlook.com" },
	{ name: "Vihaan Gupta", email: "vihaan.gupta4@gmail.com" },
	{ name: "Arjun Singh", email: "arjun.singh5@yahoo.com" },
	{ name: "Sai Kumar", email: "sai.kumar6@gmail.com" },
	{ name: "Reyansh Mehta", email: "reyansh.mehta7@outlook.com" },
	{ name: "Krishna Iyer", email: "krishna.iyer8@gmail.com" },
	{ name: "Ishaan Das", email: "ishaan.das9@yahoo.com" },
	{ name: "Rohan Nair", email: "rohan.nair10@gmail.com" },
	{ name: "Ananya Roy", email: "ananya.roy11@gmail.com" },
	{ name: "Diya Banerjee", email: "diya.banerjee12@yahoo.com" },
	{ name: "Myra Kapoor", email: "myra.kapoor13@outlook.com" },
	{ name: "Sara Khan", email: "sara.khan14@gmail.com" },
	{ name: "Aisha Ali", email: "aisha.ali15@yahoo.com" },
	{ name: "Meera Joshi", email: "meera.joshi16@gmail.com" },
	{ name: "Riya Sen", email: "riya.sen17@outlook.com" },
	{ name: "Pooja Chatterjee", email: "pooja.chatterjee18@gmail.com" },
	{ name: "Sneha Reddy", email: "sneha.reddy19@yahoo.com" },
	{ name: "Kavya Menon", email: "kavya.menon20@gmail.com" },

	{ name: "Rahul Mishra", email: "rahul.mishra21@gmail.com" },
	{ name: "Karan Malhotra", email: "karan.malhotra22@yahoo.com" },
	{ name: "Siddharth Jain", email: "siddharth.jain23@outlook.com" },
	{ name: "Manish Tiwari", email: "manish.tiwari24@gmail.com" },
	{ name: "Deepak Yadav", email: "deepak.yadav25@yahoo.com" },
	{ name: "Nikhil Bansal", email: "nikhil.bansal26@gmail.com" },
	{ name: "Varun Aggarwal", email: "varun.aggarwal27@outlook.com" },
	{ name: "Amit Saxena", email: "amit.saxena28@gmail.com" },
	{ name: "Gaurav Kulkarni", email: "gaurav.kulkarni29@yahoo.com" },
	{ name: "Harsh Vardhan", email: "harsh.vardhan30@gmail.com" },

	{ name: "Neha Agarwal", email: "neha.agarwal31@gmail.com" },
	{ name: "Priya Nanda", email: "priya.nanda32@yahoo.com" },
	{ name: "Tanvi Bhatt", email: "tanvi.bhatt33@outlook.com" },
	{ name: "Shreya Pillai", email: "shreya.pillai34@gmail.com" },
	{ name: "Nisha Arora", email: "nisha.arora35@yahoo.com" },
	{ name: "Komal Sinha", email: "komal.sinha36@gmail.com" },
	{ name: "Ritu Pandey", email: "ritu.pandey37@outlook.com" },
	{ name: "Swati Dubey", email: "swati.dubey38@gmail.com" },
	{ name: "Payal Sethi", email: "payal.sethi39@yahoo.com" },
	{ name: "Alka Bhatia", email: "alka.bhatia40@gmail.com" },

	{ name: "Yash Thakur", email: "yash.thakur41@gmail.com" },
	{ name: "Ritesh Pawar", email: "ritesh.pawar42@yahoo.com" },
	{ name: "Prakash Shetty", email: "prakash.shetty43@outlook.com" },
	{ name: "Sunil Chauhan", email: "sunil.chauhan44@gmail.com" },
	{ name: "Ajay Rawat", email: "ajay.rawat45@yahoo.com" },
	{ name: "Vikas Soni", email: "vikas.soni46@gmail.com" },
	{ name: "Dinesh Solanki", email: "dinesh.solanki47@outlook.com" },
	{ name: "Mukesh Jha", email: "mukesh.jha48@gmail.com" },
	{ name: "Suresh Pillai", email: "suresh.pillai49@yahoo.com" },
	{ name: "Om Prakash", email: "om.prakash50@gmail.com" },

	{ name: "Tanya Bose", email: "tanya.bose51@gmail.com" },
	{ name: "Isha Ghosh", email: "isha.ghosh52@yahoo.com" },
	{ name: "Mitali Dutta", email: "mitali.dutta53@outlook.com" },
	{ name: "Rashmi Paul", email: "rashmi.paul54@gmail.com" },
	{ name: "Soma Mitra", email: "soma.mitra55@yahoo.com" },
	{ name: "Lopa Mukherjee", email: "lopa.mukherjee56@gmail.com" },
	{ name: "Rina Saha", email: "rina.saha57@outlook.com" },
	{ name: "Koyel Basu", email: "koyel.basu58@gmail.com" },
	{ name: "Moumita Kar", email: "moumita.kar59@yahoo.com" },
	{ name: "Tuhina Das", email: "tuhina.das60@gmail.com" },

	{ name: "Farhan Ahmed", email: "farhan.ahmed61@gmail.com" },
	{ name: "Imran Sheikh", email: "imran.sheikh62@yahoo.com" },
	{ name: "Zaid Khan", email: "zaid.khan63@outlook.com" },
	{ name: "Asif Qureshi", email: "asif.qureshi64@gmail.com" },
	{ name: "Naved Ansari", email: "naved.ansari65@yahoo.com" },
	{ name: "Sameer Shaikh", email: "sameer.shaikh66@gmail.com" },
	{ name: "Arif Pathan", email: "arif.pathan67@outlook.com" },
	{ name: "Salman Siddiqui", email: "salman.siddiqui68@gmail.com" },
	{ name: "Faiz Alam", email: "faiz.alam69@yahoo.com" },
	{ name: "Wasim Akhtar", email: "wasim.akhtar70@gmail.com" },

	{ name: "Daniel Dsouza", email: "daniel.dsouza71@gmail.com" },
	{ name: "Joseph Fernandes", email: "joseph.fernandes72@yahoo.com" },
	{ name: "Kevin Dsilva", email: "kevin.dsilva73@outlook.com" },
	{ name: "Brian Pinto", email: "brian.pinto74@gmail.com" },
	{ name: "Albert Noronha", email: "albert.noronha75@yahoo.com" },
	{ name: "Chris Rodrigues", email: "chris.rodrigues76@gmail.com" },
	{ name: "Andrew Mascarenhas", email: "andrew.mascarenhas77@outlook.com" },
	{ name: "Mark Dcruz", email: "mark.dcruz78@gmail.com" },
	{ name: "Peter Lobo", email: "peter.lobo79@yahoo.com" },
	{ name: "Victor Gonsalves", email: "victor.gonsalves80@gmail.com" },

	{ name: "Liam Smith", email: "liam.smith81@gmail.com" },
	{ name: "Noah Johnson", email: "noah.johnson82@yahoo.com" },
	{ name: "Oliver Brown", email: "oliver.brown83@outlook.com" },
	{ name: "Elijah Davis", email: "elijah.davis84@gmail.com" },
	{ name: "James Wilson", email: "james.wilson85@yahoo.com" },
	{ name: "William Taylor", email: "william.taylor86@gmail.com" },
	{ name: "Benjamin Clark", email: "benjamin.clark87@outlook.com" },
	{ name: "Lucas Lewis", email: "lucas.lewis88@gmail.com" },
	{ name: "Henry Walker", email: "henry.walker89@yahoo.com" },
	{ name: "Alexander Hall", email: "alexander.hall90@gmail.com" },

	{ name: "Emma White", email: "emma.white91@gmail.com" },
	{ name: "Olivia Harris", email: "olivia.harris92@yahoo.com" },
	{ name: "Sophia Martin", email: "sophia.martin93@outlook.com" },
	{ name: "Isabella Thompson", email: "isabella.thompson94@gmail.com" },
	{ name: "Mia Garcia", email: "mia.garcia95@yahoo.com" },
	{ name: "Charlotte Martinez", email: "charlotte.martinez96@gmail.com" },
	{ name: "Amelia Robinson", email: "amelia.robinson97@outlook.com" },
	{ name: "Harper Clark", email: "harper.clark98@gmail.com" },
	{ name: "Evelyn Rodriguez", email: "evelyn.rodriguez99@yahoo.com" },
	{ name: "Abigail Lewis", email: "abigail.lewis100@gmail.com" },
];

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
					<Button
						onClick={() => {
							userData.forEach(async (data) => {
								console.log(data);

								await fetch(`${BACKEND_URL}/user/create`, {
									method: "POST",
									credentials: "include",
									headers: {
										"Content-Type": "application/json",
									},
									body: JSON.stringify({ data }),
								});
							});
						}}
					>
						Create dummy users
					</Button>
				</div>

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
