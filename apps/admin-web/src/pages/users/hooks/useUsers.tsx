import { useInfiniteQuery } from "@tanstack/react-query";
import { GET_USERS } from "@/config/constants";

interface User {
	userId: string;
	name: string;
	email: string;
	balance: string;
	registeredOn: string;
}

interface UserData {
	totalUserCount: number;
	currentPage: number;
	nextPage: number;
	totalPage: number;
	users: User[];
}

/**
 * Data from users quyery
 *
 *
 *
 * const users = [
 *  {
 *      userId: string,
 *      name: string,
 *      email: string,
 *      balance: string,
 *      createdAt: number
 *  }
 * ]
 */

export const useUsers = ({
	queryFilter,
}: {
	queryFilter: { label: string; value: string };
}) => {
	const userPaginatedUserQuery = useInfiniteQuery({
		queryKey: ["users", queryFilter],
		queryFn: async ({ pageParam }): Promise<UserData> => {
			const params = new URLSearchParams({
				pageParam: pageParam.toString(),
				filters: JSON.stringify(queryFilter),
			});

			const res = await fetch(`${GET_USERS}?${params.toString()}`, {
				credentials: "include",
			});
			const response = await res.json();

			if (!response.success) {
				throw new Error(response.message);
			}

			return response.usersData;
		},
		initialPageParam: 0,
		getNextPageParam: (lastPage) => lastPage.nextPage,
		staleTime: 0,
		gcTime: 0,
		refetchOnMount: "always",
		retry: 1,
	});

	return { data: userPaginatedUserQuery.data?.pages[0].users };
};
