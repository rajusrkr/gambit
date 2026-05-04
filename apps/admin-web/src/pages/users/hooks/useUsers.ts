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
		select: (pageData) => {
			const users = pageData.pages.flatMap((page) => page.users);
			const totalUserCount = pageData.pages.flatMap(
				(page) => page.totalUserCount,
			);
			const showing = pageData.pages.flatMap(
				(page) => (page.currentPage + 1) * 30 > totalUserCount[0] ? totalUserCount[0] : (page.currentPage + 1) * 30,
			);

			return { users, totalUserCount, showing };
		},
		initialPageParam: 0,
		getNextPageParam: (lastPage) => lastPage.nextPage,
		staleTime: 0,
		gcTime: 0,
		refetchOnMount: "always",
		retry: 1,
	});

	return {
		data: userPaginatedUserQuery.data?.users,
		totalUser: userPaginatedUserQuery.data?.totalUserCount[0],
		userShowing: userPaginatedUserQuery.data?.showing.at(-1),
		fetchNextPage: userPaginatedUserQuery.fetchNextPage,
		isError: userPaginatedUserQuery.isError,
		errorMessage: userPaginatedUserQuery.error,
		isLoading:
			userPaginatedUserQuery.isLoading || userPaginatedUserQuery.isPending,
		isFethchingNextPage: userPaginatedUserQuery.isFetchingNextPage,
		isFethchingNextPageError: userPaginatedUserQuery.isFetchNextPageError,
	};
};
