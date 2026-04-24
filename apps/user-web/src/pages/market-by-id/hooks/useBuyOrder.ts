import { useMutation } from "@tanstack/react-query";
import z from "zod";
import { BACKEND_URL } from "@/config/constants";
import type { BuyOrderData } from "../types";
import { useMarketByIdStore } from "../zustand-store";

export const useBuyOrder = ({
	buyOrderData,
}: {
	buyOrderData: BuyOrderData;
}) => {
	const buyOrderSchema = z.object({
		marketId: z.string(),
		orderType: z.enum(["buy"]),
		orderQty: z.number().min(1, "Minimum order qty is 1"),
		selectedOutcome: z.string(),
	});



	const {setDefaultTab} = useMarketByIdStore()

	const buyOrderMutation = useMutation({
		mutationKey: ["buy-order"],
		mutationFn: async () => {
			const validateBuyOrderData = buyOrderSchema.safeParse(buyOrderData);
			const { success, data, error } = validateBuyOrderData;

			if (!success) {
				const errorMessage = error.issues[0].message;
				throw new Error(errorMessage);
			}

			const res = await fetch(`${BACKEND_URL}/user/order/buy`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				credentials: "include",
				body: JSON.stringify(data),
			});

			const response = await res.json();

			if (!response.success) {
				throw new Error(response.message);
			}

			return response.message;
		},
		onSuccess: () => {
			setDefaultTab({defaultTab: "sell"})
		}
	});

	return buyOrderMutation;
};
