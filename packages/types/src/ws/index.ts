type MessageType = "TICKER_UPDATE" | "PORTFOLIO_DATA_UPDATE" | "CHAT";

interface Message {
	type: MessageType;
	message: string;
	payload: {
		pageRef: "home" | "market:id" | "position" | "leader_board";
		roomsToSub: string[];
	};
}

export type { Message, MessageType };
