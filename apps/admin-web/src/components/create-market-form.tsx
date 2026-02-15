import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import z from "zod";
import { useForm } from "@tanstack/react-form";
import { useRef, useState } from "react";
import { IconLoader2, IconSearch, IconSelector } from "@tabler/icons-react";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";

import {
  Item,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item";
import { cryptoCoins } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { FootballMatchDataTable } from "./foorball-match-data-table";
import { footballMatchColumn } from "./football-match-table-column";

const outcomeSchema = z.object({
  title: z.string(),
  price: z.number(),
  volume: z.number(),
});

const MIN_MARKET_START = new Date().getTime();
const formSchema = z.object({
  // Market base inputs, The common inputs
  marketBaseInput: z
    .object({
      title: z
        .string()
        .trim()
        .min(10, "Title should be at least 10 character long")
        .transform((val) => val.replace(/\s+/g, " ")),
      description: z
        .string()
        .trim()
        .min(20, "Description should be atleast 20 characters long"),
      settlementRules: z
        .string()
        .trim()
        .min(20, "Settlement rules should be at least 20 characters long"),
      category: z.enum(["sports", "crypto", "weather"]),
      outcomes: z.array(outcomeSchema).min(2, "Atleast 2 outcomes required"),
      marketStarts: z
        .number()
        .min(
          MIN_MARKET_START,
          "Select a valid market start time. (Market start time should be greater than current time)",
        ),
      marketEnds: z.number(),
    })
    .refine((data) => data.marketStarts < data.marketEnds, {
      message: "Market end time should be after market starts",
      path: ["marketEnds"],
    }),

  // This input only specific to the sports category
  sportsCategoryInput: z.object({ matchId: z.string(), match: z.string() }),

  //   This input only specific to the crypto category
  cryptoCategoryInput: z.object({
    interval: z.string().trim().min(2, "Select a valid interval"),
    cryptoName: z.string().trim().min(1, "Value is required, cannot be spaces"),
  }),
});
type FormValues = z.infer<typeof formSchema>;

interface FootballMatch {
  matchId: string;
  timestamp: string;
  leagueName: string;
  teamsHome: string;
  teamsAway: string;
}
interface FootballMatchDataRes {
  message: string;
  matches: FootballMatch[];
}

export default function CreateMarketForm() {
  // Form values
  const form = useForm({
    defaultValues: {
      marketBaseInput: {
        title: "",
        description: "",
        settlementRules: "",
        category: "",
        outcomes: [] as z.infer<typeof outcomeSchema>[],
        marketStarts: 0,
        marketEnds: 0,
      },

      sportsCategoryInput: {
        matchId: "",
        match: "",
      } as FormValues["sportsCategoryInput"],
      cryptoCategoryInput: {
        cryptoName: "",
        interval: "",
      } as FormValues["cryptoCategoryInput"],
    },

    validators: {
      onSubmit: formSchema,
    },

    onSubmit: async ({ value }) => {
      console.log(value);
    },
  });

  // Date with sports api format
  const date = new Date();
  const todayFormatted = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}-${date.getDate()}`;
  const tomorrow = new Date().setDate(date.getDate() + 1);
  const tomorrowDate = new Date(tomorrow);
  const tomorrowDateFormatted = `${tomorrowDate.getFullYear()}-${(tomorrowDate.getMonth() + 1).toString().padStart(2, "0")}-${tomorrowDate.getDate()}`;

  // States
  const outcomeRef = useRef<HTMLInputElement>(null);
  const [activeMatchButton, setActiveFetchMatchButton] = useState<
    number | null
  >(null);
  const [matchFetchDate, setMatchFetchDate] = useState("");
  const [isStartMarketCalendarOpen, setIsStartMarketCalendarOpen] =
    useState(false);
  const [isEndMarketCalendarOpen, setIsEndMarketCalendarOpen] = useState(false);
  const [cryptoSelectDialogOpen, setCryptoSelectDialogOpen] = useState(false);
  const [
    sportsMatchSelectionCommandDialogOpen,
    setIsSportsMatchSelectionCommandDialogOpen,
  ] = useState(false);
  const [isErrorMessageDialogOpen, setIsErrorMessageDialogOpen] =
    useState(false);
  const [errorMessage, setErrorMessage] = useState<{
    title: string;
    message: string;
  }>({ title: "", message: "" });
  const [coinList, setCoinList] = useState<{ coin: string }[]>([]);

  const fetchMatches = async (date: string): Promise<FootballMatchDataRes> => {
    const res = await fetch(
      `http://localhost:3333/api/v0/market/fetch-football?date=${date}`,
      { credentials: "include" },
    );
    const response = await res.json();
    if (!response.success) {
      throw new Error(response.message.toString());
    }
    return response;
  };
  // call fetch match func using usemutation
  const fetchMatchMutation = useMutation({
    mutationFn: fetchMatches,
    onSuccess: () => {
      toast.success("Football matches fetched successfully", {
        richColors: true,
        position: "top-right",
      });
    },
    onError: (err) => {
      toast.error(err.message, { richColors: true, position: "top-right" });
    },
  });

  return (
    <>
      {/* Alert dialog */}
      <AlertDialog
        open={isErrorMessageDialogOpen}
        onOpenChange={setIsErrorMessageDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{errorMessage.title}</AlertDialogTitle>
            <AlertDialogDescription>
              {errorMessage.message}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Close</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Catgory crypto dialog*/}
      <Dialog
        open={cryptoSelectDialogOpen}
        onOpenChange={setCryptoSelectDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Select a crypto currency</DialogTitle>
            <DialogDescription>
              Search and select Crypto Currency from below list
            </DialogDescription>
          </DialogHeader>

          <form.Field
            name="cryptoCategoryInput.cryptoName"
            children={(field) => {
              return (
                <>
                  <div>
                    <InputGroup>
                      <InputGroupInput
                        type="text"
                        placeholder="Search. eg: BTC"
                        onChange={(e) => {
                          // If e.target.value have something this will filterout, if not then 124 coins will be taken
                          const filteredCoin = cryptoCoins.filter((c) =>
                            c.coin.includes(e.target.value.toUpperCase()),
                          );
                          setCoinList(filteredCoin.slice(0, 5));
                        }}
                      />
                      <InputGroupAddon align={"inline-end"}>
                        <IconSearch />
                      </InputGroupAddon>
                    </InputGroup>
                  </div>

                  {coinList.map((coins, i) => (
                    <div
                      className="hover:cursor-pointer hover:bg-accent"
                      onClick={() => {
                        field.handleChange(coins.coin);
                        setCryptoSelectDialogOpen(false);
                      }}
                      key={i}
                    >
                      <Item variant={"outline"}>
                        <ItemContent>
                          <ItemTitle>{coins.coin}</ItemTitle>
                        </ItemContent>
                      </Item>
                    </div>
                  ))}
                </>
              );
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Category sports command dialog */}
      <Dialog
        open={sportsMatchSelectionCommandDialogOpen}
        onOpenChange={setIsSportsMatchSelectionCommandDialogOpen}
      >
        <DialogContent className="sm:max-w-3xl w-full">
          <DialogHeader>
            <DialogTitle>Select a football match</DialogTitle>
            <DialogDescription>
              Click on a date and search/select football match
            </DialogDescription>

            <div className="grid grid-cols-2 gap-1">
              <Button
                variant={activeMatchButton === 0 ? "default" : "outline"}
                onClick={() => {
                  if (
                    fetchMatchMutation.data &&
                    fetchMatchMutation.data.matches.length !== 0 &&
                    matchFetchDate === todayFormatted
                  ) {
                    return;
                  }
                  fetchMatchMutation.mutate(todayFormatted);
                  setActiveFetchMatchButton(0);
                  setMatchFetchDate(todayFormatted);
                }}
              >
                {"Today's matches"}
              </Button>
              <Button
                variant={activeMatchButton === 1 ? "default" : "outline"}
                onClick={() => {
                  if (
                    fetchMatchMutation.data &&
                    fetchMatchMutation.data.matches.length !== 0 &&
                    matchFetchDate === tomorrowDateFormatted
                  ) {
                    return;
                  }
                  fetchMatchMutation.mutate(tomorrowDateFormatted);
                  setActiveFetchMatchButton(1);
                  setMatchFetchDate(tomorrowDateFormatted);
                }}
              >
                {"Tomorrow's matches"}
              </Button>
            </div>
          </DialogHeader>
          <div className="overflow-hidden">
            {fetchMatchMutation.isPending && (
              <div className="flex justify-center">
                <IconLoader2 className="animate-spin" />
              </div>
            )}
            {fetchMatchMutation.data && fetchMatchMutation.data.matches && (
              <div>
                <div>
                  <p>{`Matches fetched for date: ${matchFetchDate} (YYYY-MM-DD)`}</p>
                </div>
                <FootballMatchDataTable
                  columns={footballMatchColumn}
                  data={fetchMatchMutation.data.matches}
                />
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Tabs defaultValue="form">
        <TabsList variant={"line"}>
          <TabsTrigger value="form">Form</TabsTrigger>
          <TabsTrigger value="preview">Preview & Submit</TabsTrigger>
        </TabsList>
        {/* Form */}
        <TabsContent value="form">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit();
            }}
          >
            <FieldGroup>
              <FieldDescription>
                Fill out the below form to create a new market
              </FieldDescription>
              <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
                {/* Market category */}
                <form.Field
                  name="marketBaseInput.category"
                  children={(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;

                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor={field.name}>Catgeory</FieldLabel>
                        <Select
                          name={field.name}
                          defaultValue={field.state.value}
                          onValueChange={(e) => {
                            field.handleChange(e);
                            const category = e;
                            switch (category) {
                              case "crypto":
                                setCryptoSelectDialogOpen(true);
                                break;

                              case "sports":
                                setIsSportsMatchSelectionCommandDialogOpen(
                                  true,
                                );
                                break;

                              default:
                                console.error("Unknow category");
                                return;
                            }
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select market category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>Catgories</SelectLabel>
                              <SelectItem value="sports">Sports</SelectItem>
                              <SelectItem value="crypto">Crypto</SelectItem>
                              <SelectItem value="weather">Weather</SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    );
                  }}
                />
                {/* Show input fields according to the market category */}
                {/* Crypto */}
                <form.Subscribe
                  selector={(state) => ({
                    category: state.values.marketBaseInput.category,
                    cryptoName: state.values.cryptoCategoryInput.cryptoName,
                  })}
                  children={(values) => {
                    return (
                      <>
                        {values.category === "crypto" && (
                          <form.Field
                            name="cryptoCategoryInput.cryptoName"
                            children={(field) => {
                              const isInvalid =
                                field.state.meta.isTouched &&
                                !field.state.meta.isValid;

                              return (
                                <Field data-invalid={isInvalid}>
                                  <FieldLabel htmlFor={field.name}>
                                    Crypto
                                  </FieldLabel>
                                  <Input
                                    id={field.name}
                                    name={field.name}
                                    readOnly
                                    defaultValue={values.cryptoName}
                                    onBlur={field.handleBlur}
                                    aria-invalid={isInvalid}
                                    placeholder="Select a crypto"
                                    onClick={() => {
                                      setCryptoSelectDialogOpen(true);
                                      setCoinList([]);
                                    }}
                                  />
                                  {isInvalid && (
                                    <FieldError
                                      errors={field.state.meta.errors}
                                    />
                                  )}
                                </Field>
                              );
                            }}
                          />
                        )}
                      </>
                    );
                  }}
                />
                <form.Subscribe
                  selector={(state) => ({
                    category: state.values.marketBaseInput.category,
                    cryptoName: state.values.cryptoCategoryInput.cryptoName,
                  })}
                  children={(values) => {
                    return (
                      <>
                        {values.category === "crypto" && (
                          <form.Field
                            name={"cryptoCategoryInput.interval"}
                            children={(field) => {
                              const isInvalid =
                                field.state.meta.isTouched &&
                                !field.state.meta.isValid;

                              return (
                                <Field
                                  className="w-full"
                                  data-invalid={isInvalid}
                                >
                                  <FieldLabel htmlFor={field.name}>
                                    Crypto chart interval
                                  </FieldLabel>
                                  <Select
                                    name={field.name}
                                    aria-invalid={isInvalid}
                                    onValueChange={(value) => {
                                      field.handleChange(value);
                                    }}
                                  >
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select a interval" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectGroup>
                                        <SelectLabel>Intervals</SelectLabel>
                                        <SelectItem value="1d">1D</SelectItem>
                                        <SelectItem value="5m">5M</SelectItem>
                                      </SelectGroup>
                                    </SelectContent>
                                    {isInvalid && (
                                      <FieldError
                                        errors={field.state.meta.errors}
                                      />
                                    )}
                                  </Select>
                                </Field>
                              );
                            }}
                          />
                        )}
                      </>
                    );
                  }}
                />
                {/* Sports */}
                {/* Match id, match, match starts, match ends */}
                <form.Subscribe
                  selector={(state) => ({
                    category: state.values.marketBaseInput.category,
                    match: state.values.sportsCategoryInput.match,
                    matchId: state.values.sportsCategoryInput.matchId,
                  })}
                  children={(values) => {
                    return (
                      <>
                        {values.category === "sports" && (
                          <FieldGroup className="grid grid-cols-[5fr_5fr]">
                            <Field>
                              <FieldLabel htmlFor="selected-match">
                                Match
                              </FieldLabel>
                              <Input
                                readOnly
                                name="selected-match"
                                id="selected-match"
                                placeholder="Select match"
                                onClick={() => {
                                  setIsSportsMatchSelectionCommandDialogOpen(
                                    true,
                                  );
                                }}
                              />
                            </Field>
                            <Field>
                              <FieldLabel htmlFor="selected-match-id">
                                Match Id
                              </FieldLabel>
                              <Input
                                readOnly
                                name="selected-match-id"
                                id="selected-match-id"
                                placeholder="Match Id"
                              />
                            </Field>
                          </FieldGroup>
                        )}
                      </>
                    );
                  }}
                />
                <form.Subscribe
                  selector={(state) => ({
                    category: state.values.marketBaseInput.category,
                  })}
                  children={(values) => {
                    return (
                      <>
                        {values.category === "sports" && (
                          <FieldGroup>
                            <Item variant={"outline"}>
                              <ItemContent>
                                <ItemTitle>Market timings</ItemTitle>
                                <ItemDescription className="flex gap-4">
                                  <span className="underline underline-offset-2">
                                    Starts: 12-12-2026, 12:59PM
                                  </span>
                                  <span className="underline underline-offset-2">
                                    Ends: 12-12-2026, 2:29PM
                                  </span>
                                </ItemDescription>
                              </ItemContent>
                            </Item>
                          </FieldGroup>
                        )}
                      </>
                    );
                  }}
                />

                {/* Market title */}
                <form.Field
                  name="marketBaseInput.title"
                  children={(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor={field.name}>Title</FieldLabel>
                        <Input
                          name={field.name}
                          id={field.name}
                          placeholder="Market title"
                          aria-invalid={isInvalid}
                          type="text"
                          defaultValue={field.state.value}
                          onChange={(e) => {
                            field.handleChange(e.target.value);
                          }}
                        />
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    );
                  }}
                />

                {/* Description */}
                <form.Field
                  name="marketBaseInput.description"
                  children={(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field>
                        <FieldLabel htmlFor={field.name}>
                          Description
                        </FieldLabel>
                        <Textarea
                          name={field.name}
                          id={field.name}
                          placeholder="Market description"
                          aria-invalid={isInvalid}
                          defaultValue={field.state.value}
                          onChange={(e) => {
                            field.handleChange(e.target.value);
                          }}
                        />
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    );
                  }}
                />

                {/* Settlement rules */}
                <form.Field
                  name="marketBaseInput.settlementRules"
                  children={(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field>
                        <FieldLabel htmlFor={field.name}>
                          Settlement rule
                        </FieldLabel>
                        <Textarea
                          name={field.name}
                          id={field.name}
                          aria-invalid={isInvalid}
                          placeholder="Market settlement rules"
                          onBlur={field.handleBlur}
                          defaultValue={field.state.value}
                          onChange={(e) => {
                            field.handleChange(e.target.value);
                          }}
                        />
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    );
                  }}
                />

                {/* Market starts */}
                <form.Field
                  name="marketBaseInput.marketStarts"
                  children={(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;

                    return (
                      <FieldGroup className="grid grid-cols-[8fr_2fr] gap-2">
                        <form.Subscribe
                          selector={(state) =>
                            state.values.marketBaseInput.marketStarts
                          }
                          children={(marketStarts) => {
                            return (
                              <Field data-invalid={isInvalid}>
                                <FieldLabel htmlFor={field.name}>
                                  Market start date
                                </FieldLabel>
                                <Popover
                                  open={isStartMarketCalendarOpen}
                                  onOpenChange={setIsStartMarketCalendarOpen}
                                >
                                  <PopoverTrigger asChild>
                                    <Button
                                      variant="outline"
                                      id="date-picker-optional"
                                      className="w-32 justify-between font-normal"
                                    >
                                      {marketStarts
                                        ? format(marketStarts, "PPP")
                                        : "Select date"}
                                      <IconSelector />
                                    </Button>
                                  </PopoverTrigger>
                                  <PopoverContent
                                    className="w-auto overflow-hidden p-0"
                                    align="start"
                                  >
                                    <Calendar
                                      id={field.name}
                                      mode="single"
                                      captionLayout="dropdown"
                                      startMonth={new Date(2026, 0)}
                                      endMonth={new Date(2040, 0)}
                                      onSelect={(date) => {
                                        field.handleChange(date!.getTime());
                                        setIsStartMarketCalendarOpen(false);
                                      }}
                                    />
                                  </PopoverContent>
                                </Popover>
                                {isInvalid && (
                                  <FieldError
                                    errors={field.state.meta.errors}
                                  />
                                )}
                              </Field>
                            );
                          }}
                        />

                        <form.Subscribe
                          selector={(state) =>
                            state.values.marketBaseInput.marketStarts
                          }
                          children={(marketStarts) => {
                            return (
                              <Field className="w-32">
                                <FieldLabel htmlFor="market-start-time-picker">
                                  Market start time
                                </FieldLabel>
                                <Input
                                  type="time"
                                  id="market-start-time-picker"
                                  step="1"
                                  defaultValue="00:00:00"
                                  className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                                  onChange={(e) => {
                                    const time = e.target.value;
                                    const [hours, minutes, seconds] =
                                      time.split(":");
                                    const newStartDateAndTime = new Date(
                                      marketStarts,
                                    ).setHours(
                                      parseInt(hours),
                                      parseInt(minutes),
                                      parseInt(seconds),
                                    );
                                    field.handleChange(newStartDateAndTime);
                                  }}
                                />
                              </Field>
                            );
                          }}
                        />
                      </FieldGroup>
                    );
                  }}
                />

                {/* Market ends */}
                <form.Field
                  name="marketBaseInput.marketEnds"
                  children={(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;

                    return (
                      <FieldGroup className="grid grid-cols-[8fr_2fr] gap-2">
                        <form.Subscribe
                          selector={(state) =>
                            state.values.marketBaseInput.marketEnds
                          }
                          children={(marketEnds) => {
                            return (
                              <Field data-invalid={isInvalid}>
                                <FieldLabel htmlFor={field.name}>
                                  Market end date
                                </FieldLabel>
                                <Popover
                                  open={isEndMarketCalendarOpen}
                                  onOpenChange={setIsEndMarketCalendarOpen}
                                >
                                  <PopoverTrigger asChild>
                                    <Button
                                      variant="outline"
                                      id="market-end-date-picker"
                                      className="w-32 justify-between font-normal"
                                    >
                                      {marketEnds
                                        ? format(marketEnds, "PPP")
                                        : "Select date"}
                                      <IconSelector />
                                    </Button>
                                  </PopoverTrigger>
                                  <PopoverContent
                                    className="w-auto overflow-hidden p-0"
                                    align="start"
                                  >
                                    <Calendar
                                      id={field.name}
                                      mode="single"
                                      captionLayout="dropdown"
                                      startMonth={new Date(2026, 0)}
                                      endMonth={new Date(2040, 0)}
                                      onSelect={(date) => {
                                        field.handleChange(date!.getTime());
                                        setIsEndMarketCalendarOpen(false);
                                      }}
                                    />
                                  </PopoverContent>
                                </Popover>
                                {isInvalid && (
                                  <FieldError
                                    errors={field.state.meta.errors}
                                  />
                                )}
                              </Field>
                            );
                          }}
                        />

                        <form.Subscribe
                          selector={(state) =>
                            state.values.marketBaseInput.marketEnds
                          }
                          children={(marketEnds) => {
                            return (
                              <Field className="w-32">
                                <FieldLabel htmlFor="market-end-time-picker">
                                  Market end time
                                </FieldLabel>
                                <Input
                                  type="time"
                                  id="market-end-time-picker"
                                  defaultValue="00:00:00"
                                  step="1"
                                  className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                                  onChange={(e) => {
                                    const time = e.target.value;
                                    const [hours, minutes, seconds] =
                                      time.split(":");
                                    const newMarketEndTime = new Date(
                                      marketEnds,
                                    ).setHours(
                                      parseInt(hours),
                                      parseInt(minutes),
                                      parseInt(seconds),
                                    );
                                    field.handleChange(newMarketEndTime);
                                  }}
                                />
                              </Field>
                            );
                          }}
                        />
                      </FieldGroup>
                    );
                  }}
                />

                {/* Outcomes sections */}
                <div>
                  {/* Sub to market outcomes */}
                  <form.Subscribe
                    selector={(state) => state.values.marketBaseInput.outcomes}
                    children={(outcomes) => {
                      return (
                        <Item className="mb-2" variant={"outline"}>
                          <ItemContent>
                            <ItemTitle>Outcomes</ItemTitle>
                            <ItemDescription>
                              {outcomes.map((outcome, i) => (
                                <li key={i} className="capitalize list-decimal">
                                  {`${i + 1}. ${outcome.title}`}
                                </li>
                              ))}
                            </ItemDescription>
                          </ItemContent>
                        </Item>
                      );
                    }}
                  />
                  {/* Market outcomes */}

                  <form.Subscribe
                    selector={(state) => state.values.marketBaseInput.outcomes}
                    children={(outcomes) => {
                      return (
                        <form.Field
                          name="marketBaseInput.outcomes"
                          children={(field) => {
                            const isInvalid =
                              field.state.meta.isTouched &&
                              !field.state.meta.isValid;
                            return (
                              <Field data-invalid={isInvalid}>
                                <div className="grid grid-cols-[8fr_2fr] gap-2">
                                  <Input
                                    name={field.name}
                                    id={field.name}
                                    aria-invalid={isInvalid}
                                    placeholder="Add outcomes"
                                    ref={outcomeRef}
                                    defaultValue={outcomeRef.current?.value}
                                  />
                                  <Button
                                    type="button"
                                    onClick={() => {
                                      const val = outcomeRef.current?.value;
                                      if (!val) {
                                        setIsErrorMessageDialogOpen(true);
                                        setErrorMessage({
                                          title: "Outcome cannot be empty",
                                          message:
                                            "Empty value is not allowed in outcomes fields.",
                                        });
                                        return;
                                      } else if (
                                        outcomes.filter(
                                          (outcome) =>
                                            outcome.title.toLowerCase() ===
                                            val.toLowerCase(),
                                        ).length !== 0
                                      ) {
                                        setIsErrorMessageDialogOpen(true);
                                        setErrorMessage({
                                          title: "Duplicate outcome identified",
                                          message:
                                            "Duplicate outcome identified. Same outcome cannot be repeated.",
                                        });
                                        return;
                                      } else {
                                        field.handleChange([
                                          ...(field.state.value ?? []),
                                          { title: val, price: 0, volume: 0 },
                                        ]);
                                      }

                                      if (outcomeRef.current) {
                                        outcomeRef.current.value = "";
                                      }
                                    }}
                                  >
                                    Add
                                  </Button>
                                </div>
                                {isInvalid && (
                                  <FieldError
                                    errors={field.state.meta.errors}
                                  />
                                )}
                              </Field>
                            );
                          }}
                        />
                      );
                    }}
                  />

                  <Button type="submit">Submit</Button>
                </div>
              </div>
            </FieldGroup>
          </form>
        </TabsContent>

        {/* Preview */}
        <TabsContent value="preview">
          <Card>
            <CardHeader>
              <CardTitle>preview</CardTitle>
              <CardDescription>
                View your key metrics and recent project activity. Track
                progress across all your active projects.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-muted-foreground text-sm">
              <form.Subscribe
                selector={(state) => ({
                  category: state.values.marketBaseInput.category,
                  title: state.values.marketBaseInput.title,
                })}
                children={(values) => {
                  return (
                    <div>
                      <p className="capitalize">{values.category}</p>
                      <p className="capitalize">{values.title}</p>
                    </div>
                  );
                }}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  );
}
