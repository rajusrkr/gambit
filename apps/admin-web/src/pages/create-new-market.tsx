import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useAdminStore } from "@/lib/zStore";
import { format } from "date-fns";
import { ChevronDownIcon } from "lucide-react";
import { useState } from "react";

const formTitles = [
  { title: "Category & Title", id: "CT" },
  { title: "Description & Rules", id: "DR" },
  { title: "Outcomes", id: "O" },
  { title: "Starting & Ending", id: "SE" },
  { title: "Preview", id: "P" },
];

const marketCategory = [
  { title: "Sports", value: "sports" },
  { title: "Crypto", value: "crypto" },
  { title: "Weather", value: "weather" },
];

function CategoryAndTitleFields() {
  const [selectedCategory, setSelectedCategory] = useState("");

  return (
    <div className="space-y-2">
      <form>
        <Select
          required
          onValueChange={(e) => {
            setSelectedCategory(e);
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a market category" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Categories</SelectLabel>
              {marketCategory.map((category, i) => (
                <SelectItem value={category.value} key={i}>
                  {category.title}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <Textarea required placeholder="Enter market title" className="w-66" />

        <div>
          {selectedCategory === "sports" && (
            <div>
              <Input defaultValue={"Team a vs Team b"} />
              <Input defaultValue={"Match start"} />
              <Input defaultValue={"Match ends"} />
            </div>
          )}
        </div>

        <Button type="submit">Next</Button>
      </form>
    </div>
  );
}

function DescriptionAndRules() {
  return (
    <div>
      <form>
        <Textarea required placeholder="Write description" />
        <Textarea required placeholder="Write rules" />
        <Button type="submit">Next</Button>
      </form>
    </div>
  );
}

function Outcomes() {
  return (
    <div>
      <form>
        <Input required placeholder="Outcome" type="text" />
        <Button type="submit">Add</Button>
      </form>
    </div>
  );
}

function StartingAndEnding() {
  const [startDateCalendarOpen, setStartDatealendarOpen] = useState(false);
  const [endDateCalendarOpen, setEndDatealendarOpen] = useState(false);
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);

  return (
    <div>
      {/* Start time */}
      <FieldGroup className="max-w-sm flex-row">
        <Field>
          <FieldLabel htmlFor="date-picker-optional">Date</FieldLabel>
          <Popover
            open={startDateCalendarOpen}
            onOpenChange={setStartDatealendarOpen}
          >
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                id="date-picker-optional"
                className="w-32 justify-between font-normal"
              >
                {startDate ? format(startDate, "PPP") : "Select date"}
                <ChevronDownIcon />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-auto overflow-hidden p-0"
              align="start"
            >
              <Calendar
                mode="single"
                selected={startDate}
                captionLayout="dropdown"
                defaultMonth={startDate}
                onSelect={(date) => {
                  setStartDate(date);
                  setStartDatealendarOpen(false);
                }}
              />
            </PopoverContent>
          </Popover>
        </Field>
        <Field className="w-32">
          <FieldLabel htmlFor="time-picker-optional">Time</FieldLabel>
          <Input
            type="time"
            id="time-picker-optional"
            step="1"
            defaultValue="00:00:00"
            className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
          />
        </Field>
      </FieldGroup>

      {/* End time */}
      <FieldGroup className="flex-row">
        <Field>
          <FieldLabel htmlFor="date-picker-optional">Date</FieldLabel>
          <Popover
            open={endDateCalendarOpen}
            onOpenChange={setEndDatealendarOpen}
          >
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                id="date-picker-optional"
                className="w-32 justify-between font-normal"
              >
                {endDate ? format(endDate, "PPP") : "Select date"}
                <ChevronDownIcon />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-auto overflow-hidden p-0"
              align="start"
            >
              <Calendar
                mode="single"
                selected={endDate}
                captionLayout="dropdown"
                defaultMonth={endDate}
                onSelect={(date) => {
                  setEndDate(date);
                  setEndDatealendarOpen(false);
                }}
              />
            </PopoverContent>
          </Popover>
        </Field>
        <Field className="w-32">
          <FieldLabel htmlFor="time-picker-optional">Time</FieldLabel>
          <Input
            type="time"
            id="time-picker-optional"
            step="1"
            defaultValue="00:00:00"
            className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
          />
        </Field>
      </FieldGroup>
    </div>
  );
}

export default function CreateNewMarket() {
  const { setCurrentCreateMarketFormTab, currentCreateMarketFormTab } =
    useAdminStore();

  return (
    <div className="p-10 md:flex flex-row md:space-x-0 space-y-2 gap-2">
      {/* Left- Desktop view */}
      <div className="border w-66 h-[70vh] md:flex md:flex-col hidden p-3">
        {formTitles.map((title, i) => (
          <ul
            key={i}
            className={`${currentCreateMarketFormTab === title.id ? "bg-primary/90 text-primary-foreground p-1 hover:cursor-pointer" : "p-1 hover:cursor-pointer hover:bg-primary/20 transition-all"}`}
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
      <div className="border w-full p-3 h-[70vh]">
        {currentCreateMarketFormTab === "CT" && <CategoryAndTitleFields />}
        {currentCreateMarketFormTab === "DR" && <DescriptionAndRules />}
        {currentCreateMarketFormTab === "O" && <Outcomes />}
        {currentCreateMarketFormTab === "SE" && <StartingAndEnding />}
      </div>
    </div>
  );
}
