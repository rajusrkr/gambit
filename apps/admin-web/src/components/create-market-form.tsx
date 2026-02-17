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
import { FootballMatchDataTable } from "./football-match-data-table";
import { footballMatchColumn } from "./football-match-table-column";

const outcomeSchema = z.object({
  title: z.string(),
  price: z.number(),
  volume: z.number(),
});

const MIN_MARKET_START = new Date().getTime();

interface FootballMatch {
  matchId: string;
  timestamp: number;
  time: string;
  leagueName: string;
  teamsHome: string;
  teamsAway: string;
}
interface FootballMatchDataRes {
  message: string;
  matches: FootballMatch[];
}
interface SelectedRow {
  teamsAway: string;
  teamsHome: string;
  time: string;
  timestamp: number;
  matchId: string;
}

const schema = z.discriminatedUnion("category", [
  // Sports category
  z
    .object({
      category: z.literal("sports"),
      title: z
        .string()
        .trim()
        .min(10, "Title should be at least 10 characters long"),
      description: z
        .string()
        .trim()
        .min(15, "Description should be at least 20 characters long"),
      settlementRules: z
        .string()
        .trim()
        .min(15, "Settlement rules should be at least 20 characters long"),
      outcomes: z
        .array(outcomeSchema)
        .min(2, "At least 2 outcomes is required"),
      marketStarts: z
        .number()
        .min(
          MIN_MARKET_START,
          "Select a valid market start time. (Market start time should be greater than current time)",
        ).transform((data) => Math.floor(data / 1000)),
      marketEnds: z.number().transform((data) => Math.floor(data / 1000)),
      matchId: z.string().trim().min(7, "Selected match id is not valid"),
      match: z
        .string()
        .trim()
        .min(5, "A valid match length should be atleast 5 characters long"),

      matchStarts: z.number(),
      matchEnds: z.number()
    })
    .refine((data) => data.marketStarts < data.marketEnds, {
      message: "Market end should be greater than market start time",
      path: ["marketEnds"],
    }),
  // Crypto category
  z
    .object({
      category: z.literal("crypto"),
      title: z
        .string()
        .trim()
        .min(10, "Title should be at least 10 characters long"),
      description: z
        .string()
        .trim()
        .min(15, "Description should be at least 20 characters long"),
      settlementRules: z
        .string()
        .trim()
        .min(15, "Settlement rules should be at least 20 characters long"),
      outcomes: z
        .array(outcomeSchema)
        .min(2, "At least 2 outcomes is required"),
      marketStarts: z
        .number()
        .min(
          MIN_MARKET_START,
          "Select a valid market start time. (Market start time should be greater than current time)",
        ).transform((data) => Math.floor(data / 1000)),
      marketEnds: z.number().transform((data) => Math.floor(data / 1000)),
      cryptoName: z
        .string()
        .trim()
        .min(3, "A valid crypto name should be atleast 3 characters long"),
      interval: z
        .string()
        .trim()
        .length(2, "Interval length can't be more or less than 2 characters"),
    })
    .refine((data) => data.marketStarts < data.marketEnds, {
      message: "Market end should be greater than start time",
      path: ["marketEnds"],
    }),
]);

type FormSchema = z.infer<typeof schema>;

export default function CreateMarketForm() {
  const form = useForm({
    defaultValues: {
      category: "crypto",
      title: "",
      description: "",
      settlementRules: "",
      outcomes: [] as z.infer<typeof outcomeSchema>[],
      marketStarts: 0,
      marketEnds: 0,
      cryptoName: "",
      interval: "",
    } as FormSchema,

    validators: {
      onSubmit: schema,
    },

    onSubmit: async ({ value }) => {
      const data = schema.safeParse(value);
      console.log(data.data);
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
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRow, setSelectedRow] = useState<SelectedRow[]>([]);

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
            name="cryptoName"
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
        <DialogContent className="sm:max-w-4xl w-full">
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
                    <p className="py-1 text-md font-semibold">{`Matches fetched for date: ${matchFetchDate} (YYYY-MM-DD)`}</p>
                  </div>
                <div>
                  <Input
                    placeholder="Search matches by team name..."
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                    }}
                  />
                </div>
                <FootballMatchDataTable
                  columns={footballMatchColumn}
                  data={
                    searchTerm.trim().length !== 0
                      ? fetchMatchMutation.data.matches.filter(
                          (match) =>
                            match.teamsAway
                              .toLowerCase()
                              .includes(searchTerm.toLowerCase()) ||
                            match.teamsHome
                              .toLowerCase()
                              .includes(searchTerm.toLowerCase()),
                        )
                      : fetchMatchMutation.data.matches
                  }
                  onSelectedRowChange={setSelectedRow}
                />

                <div>
                  <Button
                  disabled = {selectedRow.length === 0}
                    onClick={() => {
                      form.setFieldValue(
                        "match",
                        `${selectedRow[0].teamsHome} vs ${selectedRow[0].teamsAway}`,
                      );
                      form.setFieldValue(
                        "matchId",
                        selectedRow[0].matchId.toString(),
                      );
                      form.setFieldValue(
                        "matchStarts",
                        selectedRow[0].timestamp,
                      );
                      form.setFieldValue(
                        "matchEnds",
                        selectedRow[0].timestamp + 90 * 60,
                      );
                      setIsSportsMatchSelectionCommandDialogOpen(false)
                    }}
                  >
                    Confirm
                  </Button>
                </div>
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
                  name="category"
                  children={(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;

                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor={field.name}>Catgeory</FieldLabel>
                        <Select
                          name={field.name}
                          value={field.state.value}
                          onValueChange={(e) => {
                            form.reset();
                            field.handleChange(e as "sports" | "crypto");
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
                    category: state.values.category,
                    cryptoName:
                      state.values.category === "crypto" &&
                      state.values.cryptoName,
                  })}
                  children={(values) => {
                    return (
                      <>
                        {values.category === "crypto" && (
                          <form.Field
                            name="cryptoName"
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
                                    value={values.cryptoName.toString()}
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
                    category: state.values.category,
                    cryptoName:
                      state.values.category === "crypto" &&
                      state.values.cryptoName,
                  })}
                  children={(values) => {
                    return (
                      <>
                        {values.category === "crypto" && (
                          <form.Field
                            name={"interval"}
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
                    category: state.values.category,
                    match:
                      state.values.category === "sports" && state.values.match,
                    matchId:
                      state.values.category === "sports" &&
                      state.values.matchId,
                  })}
                  children={(values) => {
                    return (
                      <>
                        {values.category === "sports" && (
                          <FieldGroup className="grid grid-cols-[5fr_5fr]">
                            <form.Field
                              name="match"
                              children={(field) => {
                                const isInvalid =
                                  field.state.meta.isTouched &&
                                  !field.state.meta.isValid;
                                return (
                                  <Field>
                                    <FieldLabel htmlFor="selected-match">
                                      Match
                                    </FieldLabel>
                                    <Input
                                      readOnly
                                      name="selected-match"
                                      id="selected-match"
                                      placeholder="Select match"
                                      value={
                                        values.match != null
                                          ? values.match.toString()
                                          : ""
                                      }
                                      onClick={() => {
                                        setIsSportsMatchSelectionCommandDialogOpen(
                                          true,
                                        );
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

                            <form.Field
                              name="matchId"
                              children={(field) => {
                                const isInvalid =
                                  field.state.meta.isTouched &&
                                  !field.state.meta.isValid;

                                return (
                                  <Field>
                                    <FieldLabel htmlFor="selected-match-id">
                                      Match Id
                                    </FieldLabel>
                                    <Input
                                      readOnly
                                      name="selected-match-id"
                                      id="selected-match-id"
                                      placeholder="Match Id"
                                      value={
                                        values.matchId !== null
                                          ? values.matchId?.toString()
                                          : ""
                                      }
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
                          </FieldGroup>
                        )}
                      </>
                    );
                  }}
                />
                <form.Subscribe
                  selector={(state) => ({
                    category: state.values.category,
                    matchStarts:
                      state.values.category === "sports" &&
                      state.values.matchStarts,
                    matchEnds:
                      state.values.category === "sports" &&
                      state.values.matchEnds,
                  })}
                  children={(values) => {
                    return (
                      <>
                        {values.category === "sports" && (
                          <FieldGroup>
                            <Item variant={"outline"}>
                              <ItemContent>
                                <ItemTitle>Match timing</ItemTitle>

                                <form.Field
                                  name="matchStarts"
                                  children={(field) => {
                                    const isInvalid =
                                      field.state.meta.isTouched &&
                                      !field.state.meta.isValid;

                                    return (
                                      <div>
                                        <p>
                                          Match starts:{" "}
                                          <span className="underline">
                                            {values.matchStarts != null
                                              ? new Date(
                                                  Number(values.matchStarts) *
                                                    1000,
                                                ).toLocaleString()
                                              : ""}
                                          </span>
                                        </p>
                                        {isInvalid && (
                                          <FieldError
                                            errors={field.state.meta.errors}
                                          />
                                        )}
                                      </div>
                                    );
                                  }}
                                />

                                <form.Field
                                  name="matchEnds"
                                  children={(field) => {
                                    const isInvalid =
                                      field.state.meta.isTouched &&
                                      !field.state.meta.isValid;

                                    return (
                                      <div>
                                        <p>
                                          Match ends:{" "}
                                          <span className="underline">
                                            {values.matchStarts != null
                                              ? new Date(
                                                  Number(values.matchEnds) *
                                                    1000,
                                                ).toLocaleString()
                                              : ""}
                                          </span>
                                        </p>
                                        {isInvalid && (
                                          <FieldError
                                            errors={field.state.meta.errors}
                                          />
                                        )}
                                      </div>
                                    );
                                  }}
                                />
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
                  name="title"
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
                          value={field.state.value}
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
                  name="description"
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
                          value={field.state.value}
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
                  name="settlementRules"
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
                          value={field.state.value}
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
                  name="marketStarts"
                  children={(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;

                    return (
                      <FieldGroup className="grid grid-cols-[8fr_2fr] gap-2">
                        <form.Subscribe
                          selector={(state) => state.values.marketStarts}
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
                          selector={(state) => state.values.marketStarts}
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
                  name="marketEnds"
                  children={(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;

                    return (
                      <FieldGroup className="grid grid-cols-[8fr_2fr] gap-2">
                        <form.Subscribe
                          selector={(state) => state.values.marketEnds}
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
                          selector={(state) => state.values.marketEnds}
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
                    selector={(state) => state.values.outcomes}
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
                    selector={(state) => state.values.outcomes}
                    children={(outcomes) => {
                      return (
                        <form.Field
                          name="outcomes"
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

                  <Button type="submit" className="mt-2">Submit & Create new market</Button>
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
                  category: state.values.category,
                  title: state.values.title,
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
