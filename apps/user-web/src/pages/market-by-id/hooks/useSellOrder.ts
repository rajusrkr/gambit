import { useMutation } from "@tanstack/react-query";
import z from "zod";
import { BACKEND_URL } from "@/config/constants";
import type { SellOrderData } from "../types";

export const useSellOrder = ({
	sellOrderData,
}: {
	sellOrderData: SellOrderData;
}) => {
	const sellOrderSchema = z.object({
		positionId: z.string(),
		marketId: z.string(),
		orderType: z.enum(["sell"]),
		orderQty: z.number().min(1, "Minimum order qty is 1"),
		selectedOutcome: z.string(),
	});

	const sellOrderMutation = useMutation({
		mutationKey: ["sell-order"],
		mutationFn: async () => {
			const validateSellOrderData = sellOrderSchema.safeParse(sellOrderData);
			const { success, data, error } = validateSellOrderData;
			console.log(sellOrderData);
			console.log(error);
			
			

			if (!success) {
				const errorMessage = error.issues[0].message;
				throw new Error(errorMessage);
			}

			const res = await fetch(`${BACKEND_URL}/user/order/sell`, {
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
	});

	return sellOrderMutation;
};
