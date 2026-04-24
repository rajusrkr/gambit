import { useEffect, useRef } from "react";
import { useDiscussion } from "../hooks/useDiscussion";
import type { MarketStatus } from "../types";
import { IconLoader2, IconSend } from "@tabler/icons-react";
import { Item, ItemDescription, ItemTitle } from "@/components/ui/item";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function DiscussionTab({
  marketId,
  marketStatus,
}: {
  marketId: string;
  marketStatus: MarketStatus;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const {
    data: discussions,
    isError,
    errorMesage,
    isLoading,
  } = useDiscussion({ marketId });

  useEffect(() => {
    const container = scrollRef.current;

    if (container) {
      /**
       * Total height of the message, how much scrolled from the top, what is client height
       * Subtract three and get the rest of the scrollheight
       * if scroll height is less than 500 that means the user is near bottom
       */
      const distanceToBottom =
        container.scrollHeight - container.scrollTop - container.clientHeight;
      const isNearBottom = distanceToBottom < 500;

      if (isNearBottom) {
        container.scrollTo({
          top: container.scrollHeight,
          behavior: "smooth",
        });
      }
    }
  }, [discussions]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, []);

  if (marketStatus === "open_soon") {
    return (
      <div className="h-96 flex justify-center items-center">
        <p className="font-semibold text-gray-500">
          This market market is not open. <br /> As soon as it opens discussion
          tab will be open
        </p>
      </div>
    );
  }

  return isLoading ? (
    <div className="h-96 flex justify-center items-center">
      <IconLoader2 className="animate-spin" />
    </div>
  ) : isError ? (
    <div className="h-96 flex justify-center items-center">
      {errorMesage?.message}
    </div>
  ) : (
    <div className="flex flex-col h-96 relative">
      <div className="mb-8">
        <div className="text-2xl font-semibold">Discuss about this event</div>
        <div className="font-semibold text-gray-500">
          Discuss about this event with your fellow traders
        </div>
      </div>

      <div>
        <div
          ref={scrollRef}
          className="max-h-96 overflow-y-auto no-scrollbar mask-[linear-gradient(to_bottom,black_80%,transparent_100%)] pb-10 flex-1"
        >
          {discussions?.length === 0 ? (
            <div className="flex justify-center items-center font-semibold h-52 underline underline-offset-2">
              There are no discussions to show
            </div>
          ) : (
            discussions?.map((discussion) => (
              <Item
                key={discussion.id}
                className={`${discussion.userName === "Jason" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`${discussion.userName === "Jason" ? "bg-primary" : "bg-accent"} p-2 rounded-sm`}
                >
                  <ItemTitle
                    className={`${discussion.userName === "Jason" && "dark:text-white text-white"}`}
                  >
                    {discussion.message}
                  </ItemTitle>
                  <ItemDescription
                    className={`${discussion.userName === "Jason" && "dark:text-gray-400 text-gray-300"}`}
                  >
                    {discussion.userName === "Jason"
                      ? "You"
                      : discussion.userName}
                  </ItemDescription>
                </div>
              </Item>
            ))
          )}
        </div>
        <div>
          <div className="flex gap-1 items-end">
            <Textarea
              placeholder="Message"
              // onChange={(e) => {
              // 	setMessage(e.target.value);
              // }}
            />
            <Button
              className="h-16 w-20 space-x-2"
              onClick={() => {
                // setDiscussion({
                // 	discussion: { id: "30", message: message, user: "Jason" },
                // });
              }}
            >
              <IconSend className="size-6" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
