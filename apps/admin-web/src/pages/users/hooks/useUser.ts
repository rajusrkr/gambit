import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
	GET_USER,
	UPDATE_USER_ACCOUNT_STATUS,
	UPDATE_USER_WITHDRAWAL_STATUS,
} from "@/config/constants";
import { toast } from "sonner";

interface User {
	name: string;
	email: string;
	accountCreated: string;
	balance: string;
	is2faOn: boolean;
	withdrawalAllowed: "yes" | "no";
	isAccountActive: "active" | "suspended";
}

const useUser = ({ userId }: { userId: string }) => {
	const userQuery = useQuery({
		queryKey: ["user", userId],
		queryFn: async (): Promise<User> => {
			const res = await fetch(`${GET_USER}?userId=${userId}`, {
				method: "GET",
				credentials: "include",
			});

			const response = await res.json();

			if (!res.ok) {
				throw new Error(response.message);
			}

			return response.user;
		},
	});

	return {
		data: userQuery.data,
		isLoading: userQuery.isLoading || userQuery.isPending,
		isError: userQuery.isError,
		errorMessage: userQuery.error,
	};
};

const useUpdateWithdrawalStatus = ({
	userId,
	status,
}: {
	userId: string;
	status: "yes" | "no";
}) => {
	const queryClient = useQueryClient();
	const withdrawalStatusUpdatMutation = useMutation({
		mutationKey: ["update-withdrawal-status", userId],
		mutationFn: async (): Promise<string> => {
			const res = await fetch(`${UPDATE_USER_WITHDRAWAL_STATUS}`, {
				method: "PATCH",
				credentials: "include",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ status, userId }),
			});
			const response = await res.json();
			if (!res.ok) {
				throw new Error(response.message);
			}
			return response.message;
		},
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: ["user", userId] });
			toast.success(data, { richColors: true, position: "top-right" });
		},
		onError: (error) => {
			toast.error(error.message, { richColors: true, position: "top-right" });
		},
	});

	return {
		mutate: withdrawalStatusUpdatMutation.mutate,
		isLoading: withdrawalStatusUpdatMutation.isPending,
	};
};

const useUpdateAccountStatus = ({
	userId,
	status,
}: {
	userId: string;
	status: "active" | "suspended";
}) => {
	const queryClient = useQueryClient();
	const updateAccountStatusMutation = useMutation({
		mutationKey: ["update-account-status", userId],
		mutationFn: async (): Promise<string> => {
			const res = await fetch(`${UPDATE_USER_ACCOUNT_STATUS}`, {
				method: "PATCH",
				credentials: "include",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ status, userId }),
			});
			const response = await res.json();
			if (!res.ok) {
				throw new Error(response.message);
			}
			return response.message;
		},
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: ["user", userId] });
			toast.success(data, { richColors: true, position: "top-right" });
		},
		onError: (error) => {
			toast.error(error.message, { richColors: true, position: "top-right" });
		},
	});

	return {
		mutate: updateAccountStatusMutation.mutate,
		isLoading: updateAccountStatusMutation.isPending,
	};
};

export { useUser, useUpdateWithdrawalStatus, useUpdateAccountStatus };
