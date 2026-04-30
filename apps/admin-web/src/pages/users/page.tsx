import UserTable from "./component/UserTable";
export interface Users {
	name: string;
	email: string;
	accountBalance: string;
	userId: `${string}-${string}-${string}-${string}-${string}`;
}

const users = [
	{
		name: "John",
		email: "john@mail.com",
		accountBalance: "$100",
		userId: crypto.randomUUID(),
	},
	{
		name: "Alice",
		email: "alice@mail.com",
		accountBalance: "$250",
		userId: crypto.randomUUID(),
	},
	{
		name: "Bob",
		email: "bob@mail.com",
		accountBalance: "$320",
		userId: crypto.randomUUID(),
	},
	{
		name: "Charlie",
		email: "charlie@mail.com",
		accountBalance: "$150",
		userId: crypto.randomUUID(),
	},
	{
		name: "David",
		email: "david@mail.com",
		accountBalance: "$410",
		userId: crypto.randomUUID(),
	},
	{
		name: "Emma",
		email: "emma@mail.com",
		accountBalance: "$275",
		userId: crypto.randomUUID(),
	},
	{
		name: "Frank",
		email: "frank@mail.com",
		accountBalance: "$90",
		userId: crypto.randomUUID(),
	},
	{
		name: "Grace",
		email: "grace@mail.com",
		accountBalance: "$600",
		userId: crypto.randomUUID(),
	},
	{
		name: "Hannah",
		email: "hannah@mail.com",
		accountBalance: "$720",
		userId: crypto.randomUUID(),
	},
	{
		name: "Ian",
		email: "ian@mail.com",
		accountBalance: "$50",
		userId: crypto.randomUUID(),
	},
	{
		name: "Jack",
		email: "jack@mail.com",
		accountBalance: "$180",
		userId: crypto.randomUUID(),
	},
	{
		name: "Karen",
		email: "karen@mail.com",
		accountBalance: "$340",
		userId: crypto.randomUUID(),
	},
	{
		name: "Leo",
		email: "leo@mail.com",
		accountBalance: "$410",
		userId: crypto.randomUUID(),
	},
	{
		name: "Mia",
		email: "mia@mail.com",
		accountBalance: "$510",
		userId: crypto.randomUUID(),
	},
	{
		name: "Noah",
		email: "noah@mail.com",
		accountBalance: "$130",
		userId: crypto.randomUUID(),
	},
	{
		name: "Olivia",
		email: "olivia@mail.com",
		accountBalance: "$220",
		userId: crypto.randomUUID(),
	},
	{
		name: "Paul",
		email: "paul@mail.com",
		accountBalance: "$310",
		userId: crypto.randomUUID(),
	},
	{
		name: "Quinn",
		email: "quinn@mail.com",
		accountBalance: "$270",
		userId: crypto.randomUUID(),
	},
	{
		name: "Ryan",
		email: "ryan@mail.com",
		accountBalance: "$390",
		userId: crypto.randomUUID(),
	},
	{
		name: "Sophia",
		email: "sophia@mail.com",
		accountBalance: "$800",
		userId: crypto.randomUUID(),
	},
	{
		name: "Tom",
		email: "tom@mail.com",
		accountBalance: "$120",
		userId: crypto.randomUUID(),
	},
	{
		name: "Uma",
		email: "uma@mail.com",
		accountBalance: "$260",
		userId: crypto.randomUUID(),
	},
	{
		name: "Victor",
		email: "victor@mail.com",
		accountBalance: "$470",
		userId: crypto.randomUUID(),
	},
	{
		name: "Wendy",
		email: "wendy@mail.com",
		accountBalance: "$360",
		userId: crypto.randomUUID(),
	},
	{
		name: "Xavier",
		email: "xavier@mail.com",
		accountBalance: "$540",
		userId: crypto.randomUUID(),
	},
	{
		name: "Yara",
		email: "yara@mail.com",
		accountBalance: "$150",
		userId: crypto.randomUUID(),
	},
	{
		name: "Zane",
		email: "zane@mail.com",
		accountBalance: "$200",
		userId: crypto.randomUUID(),
	},
	{
		name: "Aarav",
		email: "aarav@mail.com",
		accountBalance: "$310",
		userId: crypto.randomUUID(),
	},
	{
		name: "Diya",
		email: "diya@mail.com",
		accountBalance: "$420",
		userId: crypto.randomUUID(),
	},
	{
		name: "Kabir",
		email: "kabir@mail.com",
		accountBalance: "$230",
		userId: crypto.randomUUID(),
	},
	{
		name: "Ananya",
		email: "ananya@mail.com",
		accountBalance: "$610",
		userId: crypto.randomUUID(),
	},
	{
		name: "Rohan",
		email: "rohan@mail.com",
		accountBalance: "$290",
		userId: crypto.randomUUID(),
	},
	{
		name: "Isha",
		email: "isha@mail.com",
		accountBalance: "$480",
		userId: crypto.randomUUID(),
	},
	{
		name: "Arjun",
		email: "arjun@mail.com",
		accountBalance: "$520",
		userId: crypto.randomUUID(),
	},
	{
		name: "Meera",
		email: "meera@mail.com",
		accountBalance: "$330",
		userId: crypto.randomUUID(),
	},
	{
		name: "Kiran",
		email: "kiran@mail.com",
		accountBalance: "$410",
		userId: crypto.randomUUID(),
	},
	{
		name: "Neha",
		email: "neha@mail.com",
		accountBalance: "$260",
		userId: crypto.randomUUID(),
	},
	{
		name: "Sahil",
		email: "sahil@mail.com",
		accountBalance: "$370",
		userId: crypto.randomUUID(),
	},
	{
		name: "Pooja",
		email: "pooja@mail.com",
		accountBalance: "$440",
		userId: crypto.randomUUID(),
	},
	{
		name: "Manish",
		email: "manish@mail.com",
		accountBalance: "$180",
		userId: crypto.randomUUID(),
	},
	{
		name: "Sneha",
		email: "sneha@mail.com",
		accountBalance: "$300",
		userId: crypto.randomUUID(),
	},
	{
		name: "Varun",
		email: "varun@mail.com",
		accountBalance: "$520",
		userId: crypto.randomUUID(),
	},
	{
		name: "Nikhil",
		email: "nikhil@mail.com",
		accountBalance: "$610",
		userId: crypto.randomUUID(),
	},
	{
		name: "Aisha",
		email: "aisha@mail.com",
		accountBalance: "$240",
		userId: crypto.randomUUID(),
	},
	{
		name: "Rahul",
		email: "rahul@mail.com",
		accountBalance: "$350",
		userId: crypto.randomUUID(),
	},
	{
		name: "Simran",
		email: "simran@mail.com",
		accountBalance: "$470",
		userId: crypto.randomUUID(),
	},
	{
		name: "Dev",
		email: "dev@mail.com",
		accountBalance: "$280",
		userId: crypto.randomUUID(),
	},
	{
		name: "Tina",
		email: "tina@mail.com",
		accountBalance: "$390",
		userId: crypto.randomUUID(),
	},
	{
		name: "Aditya",
		email: "aditya@mail.com",
		accountBalance: "$560",
		userId: crypto.randomUUID(),
	},
];

export default function Users() {
	return <UserTable users={users} />;
}
