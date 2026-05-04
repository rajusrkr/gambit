import { useState } from "react";
import { IconLoader2 } from "@tabler/icons-react";
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
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	useUpdateAccountStatus,
	useUpdateWithdrawalStatus,
	useUser,
} from "../hooks/useUser";

export default function UserDialogContent({ userId }: { userId: string }) {
	const { data: user, errorMessage, isError, isLoading } = useUser({ userId });

	const [isAccountStatusChanging, setIsaccountStatusChanging] = useState(false);
	const [accountStatus, setAccountStatus] = useState<"active" | "suspended">(
		user?.isAccountActive as "active" | "suspended",
	);
	const [isWithdrawalStatusChanging, setIsWithdrawalStatusChanging] =
		useState(false);
	const [withdrawalStatus, setWithdrawalStatus] = useState<"yes" | "no">(
		user?.withdrawalAllowed as "yes" | "no",
	);

	const {
		mutate: accountStatusUpdate,
		isLoading: isAccountStatusChangeLoading,
	} = useUpdateAccountStatus({
		userId,
		status: accountStatus,
	});

	const {
		isLoading: isWithdrawalStatusLoading,
		mutate: withdrawalStatusUpdate,
	} = useUpdateWithdrawalStatus({ status: withdrawalStatus, userId });

	return isLoading ? (
		<div>
			<IconLoader2 />
		</div>
	) : isError ? (
		<div>{errorMessage?.message}</div>
	) : (
		<div>
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead className="font-bold">Title</TableHead>
						<TableHead className="font-bold">Value</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					<TableRow>
						<TableCell className="font-medium">Name</TableCell>
						<TableCell>{user?.name}</TableCell>
					</TableRow>
					<TableRow>
						<TableCell className="font-medium">Email</TableCell>
						<TableCell>{user?.email}</TableCell>
					</TableRow>
					<TableRow>
						<TableCell className="font-medium">Balance</TableCell>
						<TableCell>{user?.balance}</TableCell>
					</TableRow>
					<TableRow>
						<TableCell className="font-medium">Account created</TableCell>
						<TableCell>{user?.accountCreated}</TableCell>
					</TableRow>
					<TableRow>
						<TableCell className="font-medium">Is 2fa on</TableCell>
						<TableCell className="flex items-center gap-2">
							<Select value={user?.is2faOn ? "yes" : "no"}>
								<SelectTrigger className="w-full max-w-20">
									<SelectValue placeholder="Select 2FA status" />
								</SelectTrigger>
								<SelectContent>
									<SelectGroup>
										<SelectLabel>2FA status</SelectLabel>
										<SelectItem value="yes">Yes</SelectItem>
										<SelectItem value="no">No</SelectItem>
									</SelectGroup>
								</SelectContent>
							</Select>
						</TableCell>
					</TableRow>
					<TableRow>
						<TableCell className="font-medium">Withdrawal flag</TableCell>
						<TableCell className="flex items-center gap-2">
							<Select
								defaultValue={user?.withdrawalAllowed}
								onValueChange={(e) => {
									setIsWithdrawalStatusChanging(true);
									setWithdrawalStatus(e as "yes" | "no");
								}}
							>
								<SelectTrigger className="w-full max-w-20">
									<SelectValue placeholder="Select withdrawal status" />
								</SelectTrigger>
								<SelectContent>
									<SelectGroup>
										<SelectLabel>Withdrawal status</SelectLabel>
										<SelectItem value="yes">Yes</SelectItem>
										<SelectItem value="no">No</SelectItem>
									</SelectGroup>
								</SelectContent>
							</Select>
							{isWithdrawalStatusLoading && (
								<IconLoader2 className="animate-spin text-gray-500" />
							)}
							{isWithdrawalStatusChanging &&
								withdrawalStatus !== user?.withdrawalAllowed && (
									<Dialog>
										<DialogTrigger asChild>
											<Button variant={"secondary"}>Save</Button>
										</DialogTrigger>
										<DialogContent>
											<DialogHeader>
												<DialogTitle>Alert!!</DialogTitle>
												<DialogDescription>
													Are you sure you want to do this? <br />
													Changing status to:{" "}
													{withdrawalStatus === "yes" ? "Yes" : "No"}
												</DialogDescription>
											</DialogHeader>
											<DialogFooter>
												<DialogClose>Close</DialogClose>
												<DialogClose asChild>
													<Button
														onClick={() => {
															withdrawalStatusUpdate();
														}}
													>
														Confirm
													</Button>
												</DialogClose>
											</DialogFooter>
										</DialogContent>
									</Dialog>
								)}
						</TableCell>
					</TableRow>
					<TableRow>
						<TableCell className="font-medium">Account status</TableCell>
						<TableCell className="flex items-center gap-2">
							<Select
								defaultValue={user?.isAccountActive}
								onValueChange={(e) => {
									setIsaccountStatusChanging(true);
									setAccountStatus(e as "active" | "suspended");
								}}
							>
								<SelectTrigger className="w-full max-w-24">
									<SelectValue placeholder="Select account status" />
								</SelectTrigger>
								<SelectContent>
									<SelectGroup>
										<SelectLabel>Account status</SelectLabel>
										<SelectItem value="active">Active</SelectItem>
										<SelectItem value="suspended">Suspend</SelectItem>
									</SelectGroup>
								</SelectContent>
							</Select>

							{isAccountStatusChangeLoading && (
								<IconLoader2 className="animate-spin text-gray-500" />
							)}

							{isAccountStatusChanging &&
								accountStatus !== user?.isAccountActive && (
									<Dialog>
										<DialogTrigger asChild>
											<Button variant={"secondary"}>Save</Button>
										</DialogTrigger>
										<DialogContent>
											<DialogHeader>
												<DialogTitle>Alert!!</DialogTitle>
												<DialogDescription>
													Are you sure you want to do this? <br />
													Changing status to:{" "}
													{accountStatus === "active" ? "Active" : "Supended"}
												</DialogDescription>
											</DialogHeader>
											<DialogFooter>
												<DialogClose>Close</DialogClose>
												<DialogClose asChild>
													<Button
														onClick={() => {
															accountStatusUpdate();
														}}
													>
														Confirm
													</Button>
												</DialogClose>
											</DialogFooter>
										</DialogContent>
									</Dialog>
								)}
						</TableCell>
					</TableRow>
				</TableBody>
			</Table>
		</div>
	);
}
