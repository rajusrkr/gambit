import { useAdminStore } from "@/lib/zStore";

const formTitles = [
  { title: "Category & Title", id: "CT" },
  { title: "Description & Rules", id: "DR" },
  { title: "Outcomes", id: "O" },
  { title: "Starting & Ending", id: "SE" },
];

export default function CreateNewMarket() {
  const { setCurrentCreateMarketFormTab, currentCreateMarketFormTab } =
    useAdminStore();

  return (
    <div className="p-10">
      {/* Left- Desktop view */}
      <div className="border w-66 h-[70vh] md:flex md:flex-col hidden p-3 gap-2">
        {formTitles.map((title, i) => (
          <ul
            key={i}
            className={`${currentCreateMarketFormTab === title.id ? "bg-accent-foreground text-accent p-1 hover:cursor-pointer" : "p-1 hover:cursor-pointer hover:bg-neutral-100 transition-all"}`}
          >
            <li
              onClick={() => {
                setCurrentCreateMarketFormTab(title.id);
              }}
            >
              {title.title}
            </li>
          </ul>
        ))}
      </div>

      {/* Top- Mobile view */}
      <div className="w-full border-b border-gray-200 md:hidden flex">
        <ul className="flex gap-4 overflow-x-auto scrollbar-hide px-2 focus:outline-none">
          {formTitles.map((title, i) => (
            <li
              key={i}
              onClick={() => {
                setCurrentCreateMarketFormTab(title.id);
              }}
              className={`${currentCreateMarketFormTab === title.id ? "shrink-0 whitespace-nowrap hover:cursor-pointer bg-accent-foreground text-accent px-1" : " px-1 shrink-0 whitespace-nowrap hover:cursor-pointer"}`}
            >
              {title.title}
            </li>
          ))}
        </ul>
      </div>

      {/* Right */}
      <div></div>
    </div>
  );
}
