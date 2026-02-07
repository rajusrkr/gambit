import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
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
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import z from "zod";
import { useForm } from "@tanstack/react-form";
import { useRef, useState } from "react";
import { IconProgressX, IconSelector } from "@tabler/icons-react";
import { format } from "date-fns";

const outcomeSchema = z.object({
  title: z.string(),
  price: z.number(),
  volume: z.number(),
});

const formSchema = z.object({
  // Market base inputs, The commong inputs
  marketBaseInput: z
    .object({
      title: z
        .string()
        .trim()
        .min(10, "Title should be at least 10 character long"),
      description: z.string(),
      settlementRules: z.string(),
      category: z.enum(["sports", "crypto", "weather"]),
      outcomes: z.array(outcomeSchema),
      marketStarts: z.number(),
      marketEnds: z.number(),
    })
    .refine((data) => data.marketEnds > data.marketStarts, {
      message: "Market end time must be after market starts",
      path: ["marketEnds"],
    }),
  // This input only specific to the sports category
  sportsCategoryInput: z.object({ matchId: z.string() }).or(z.undefined()),
  //   This input only specific to the crypto category
  cryptoCategoryInput: z
    .object({ interval: z.string(), cryptoName: z.string() })
    .or(z.undefined()),
});
type FormValues = z.infer<typeof formSchema>;

export default function CreateMarketForm() {
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
      sportsCategoryInput: { matchId: "" } as FormValues["sportsCategoryInput"],
      cryptoCategoryInput: {
        cryptoName: "",
        interval: "",
      } as FormValues["cryptoCategoryInput"],
    },
    validators: {
      onSubmit: formSchema,
    },
  });

  const outcomeRef = useRef<HTMLInputElement>(null);
  const [isAlertShowing, setIsAlertShowing] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const [marketStartDate, setMarketStartDate] = useState<Date | undefined>(
    undefined,
  );
  const [marketEndDate, setMarketEndDate] = useState<Date | undefined>(
    undefined,
  );

  const [isStartMarketCalendarOpen, setIsStartMarketCalendarOpen] =
    useState(false);
  const [isEndMarketCalendarOpen, setIsEndMarketCalendarOpen] = useState(false);

  return (
    <>
      <AlertDialog open={isAlertShowing} onOpenChange={setIsAlertShowing}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogMedia>
              <IconProgressX />
            </AlertDialogMedia>
            <AlertDialogTitle>Problem in adding outomes</AlertDialogTitle>
            <AlertDialogDescription>{alertMessage}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Tabs defaultValue="form">
        <TabsList variant={"line"}>
          <TabsTrigger value="form">Form</TabsTrigger>
          <TabsTrigger value="preview">Preview & Submit</TabsTrigger>
        </TabsList>
        {/* Form */}
        <TabsContent value="form">
          <form>
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
                  children={() => {
                    return (
                      <Field>
                        <FieldGroup className="grid grid-cols-[8fr_2fr] gap-2">
                          <Field>
                            <FieldLabel htmlFor="market-start-doptionalate">
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
                                  {marketStartDate
                                    ? format(marketStartDate, "PPP")
                                    : "Select date"}
                                  <IconSelector />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent
                                className="w-auto overflow-hidden p-0"
                                align="start"
                              >
                                <Calendar
                                  mode="single"
                                  captionLayout="dropdown"
                                  startMonth={new Date(2026, 0)}
                                  endMonth={new Date(2040, 0)}
                                  onSelect={(date) => {
                                    console.log(date);

                                    setMarketStartDate(date);
                                    setIsStartMarketCalendarOpen(false);
                                  }}
                                />
                              </PopoverContent>
                            </Popover>
                          </Field>
                          <Field className="w-32">
                            <FieldLabel htmlFor="time-picker-optional">
                              Market start time
                            </FieldLabel>
                            <Input
                              type="time"
                              id="market-start-time-picker"
                              step="1"
                              defaultValue="00:00:00"
                              className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                              onChange={(e) => {
                                console.log(e.target.value);
                              }}
                            />
                          </Field>
                        </FieldGroup>
                      </Field>
                    );
                  }}
                />

                {/* Market ends */}
                <form.Field
                  name="marketBaseInput.marketStarts"
                  children={() => {
                    return (
                      <Field>
                        <FieldGroup className="grid grid-cols-[8fr_2fr] gap-2">
                          <Field>
                            <FieldLabel htmlFor="market-end-date">
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
                                  {marketEndDate
                                    ? format(marketEndDate, "PPP")
                                    : "Select date"}
                                  <IconSelector />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent
                                className="w-auto overflow-hidden p-0"
                                align="start"
                              >
                                <Calendar
                                  mode="single"
                                  captionLayout="dropdown"
                                  startMonth={new Date(2026, 0)}
                                  endMonth={new Date(2040, 0)}
                                  onSelect={(date) => {
                                    setMarketEndDate(date);
                                    setIsEndMarketCalendarOpen(false);
                                  }}
                                />
                              </PopoverContent>
                            </Popover>
                          </Field>
                          <Field className="w-32">
                            <FieldLabel htmlFor="time-picker-optional">
                              Market end time
                            </FieldLabel>
                            <Input
                              type="time"
                              id="market-end-time-picker"
                              defaultValue="00:00:00"
                              step="1"
                              className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                            />
                          </Field>
                        </FieldGroup>
                      </Field>
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
                        <Card className="mb-2">
                          <CardHeader>Outcomes</CardHeader>
                          <CardContent>
                            <ul>
                              {outcomes.map((outcome, i) => (
                                <li key={i} className="capitalize list-decimal">
                                  {outcome.title}
                                </li>
                              ))}
                            </ul>
                          </CardContent>
                        </Card>
                      );
                    }}
                  />
                  {/* Market outcomes */}
                  <form.Field
                    name="marketBaseInput.outcomes"
                    children={(field) => {
                      const isInvalid =
                        field.state.meta.isTouched && !field.state.meta.isValid;
                      return (
                        <Field>
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
                                  setIsAlertShowing(true);
                                  setAlertMessage(
                                    "Write something to add it to the outcomes",
                                  );
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
                        </Field>
                      );
                    }}
                  />
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
