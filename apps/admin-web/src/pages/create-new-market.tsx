/**
 * This file is the admin interface for creating new prediction market.
 * It allows an admin to add a new market by selecting market category,
 * definging outcomes and schedule the market
 *
 * This page file is mainly a form, that uses useForm from tanstack and zod for validating form fields
 */

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "@tanstack/react-form";
import { format } from "date-fns";
import { ChevronDownIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { z } from "zod";

const outcomeSchema = z.object({
  title: z.string(),
  price: z.number(),
  volume: z.number(),
});

const formSchema = z.object({
  marketBaseInput: z
    .object({
      title: z.string().trim().min(10, "Title is too short. (min 10 char)"),
      description: z.string(),
      settlementRules: z.string(),
      category: z.enum(["sports", "crypto", "weather"]),
      outcomes: z.array(outcomeSchema),
      marketStarts: z.number(),
      marketEnds: z.number(),
    })
    .refine((data) => data.marketEnds > data.marketStarts, {
      message: "Market must end after it started",
      path: ["marketEnds"],
    }),
  sportsCategoryInput: z
    .object({
      matchId: z.string(),
    })
    .or(z.undefined()),
  cryptoCategoryInput: z
    .object({
      interval: z.string(),
      cryptoName: z.string(),
    })
    .or(z.undefined()),
});

type FormValues = z.infer<typeof formSchema>;

export default function CreateNewMarket() {
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
      } as FormValues["sportsCategoryInput"],
      cryptoCategoryInput: {
        interval: "",
        cryptoName: "",
      } as FormValues["cryptoCategoryInput"],
    },
    validators: {
      onSubmit: formSchema,
    },
  });

  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [singleOutcomeVal, setSingleOutcomeVal] = useState("");
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(undefined);

  useEffect(() => {
    // form.setFieldValue("")
  }, []);

  return (
    <Tabs defaultValue="form" className="p-5">
      <TabsList variant={"line"}>
        <TabsTrigger value="form">Form</TabsTrigger>
        <TabsTrigger value="preview">Preview</TabsTrigger>
      </TabsList>
      <TabsContent value="form">
        <Card>
          <CardHeader>
            <CardTitle>Create a new market</CardTitle>
            <CardDescription>
              Fill out this form to create a new market. All fields are
              required.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-muted-foreground text-sm">
            <form>
              <FieldGroup>
                <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
                  {/* Market baseinput, market category */}
                  <form.Field
                    name="marketBaseInput.category"
                    children={(field) => {
                      const isInvalid =
                        field.state.meta.isTouched && !field.state.meta.isValid;
                      return (
                        <Field data-invalid={isInvalid}>
                          <FieldLabel htmlFor={field.name}>Catgory</FieldLabel>
                          <Select
                            defaultValue={selectedCategory}
                            name={field.name}
                            onValueChange={(e) => {
                              field.handleChange(e);
                              setSelectedCategory(e);
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select market category" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                <SelectLabel>Categories</SelectLabel>
                                <SelectItem value="sports">Sports</SelectItem>
                                <SelectItem value="crypto">Crypto</SelectItem>
                                <SelectItem value="weather">Weather</SelectItem>
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        </Field>
                      );
                    }}
                  />
                  {selectedCategory.length !== 0 && (
                    <>
                      {/* Market base input, market title */}
                      <form.Field
                        name="marketBaseInput.title"
                        children={(field) => {
                          const isInvalid =
                            field.state.meta.isTouched &&
                            !field.state.meta.isValid;
                          return (
                            <Field data-invalid={isInvalid}>
                              <FieldLabel htmlFor={field.name}>
                                Title
                              </FieldLabel>
                              <Input
                                id={field.name}
                                name={field.name}
                                value={field.state.value}
                                onBlur={field.handleBlur}
                                onChange={(e) =>
                                  field.handleChange(e.target.value)
                                }
                                aria-invalid={isInvalid}
                                placeholder="Market Title"
                                type="text"
                              />
                              {isInvalid && (
                                <FieldError errors={field.state.meta.errors} />
                              )}
                            </Field>
                          );
                        }}
                      />
                      {/* Market baseinput, market description */}
                      <form.Field
                        name="marketBaseInput.description"
                        children={(field) => {
                          const isInvalid =
                            field.state.meta.isTouched &&
                            !field.state.meta.isValid;

                          return (
                            <Field data-invalid={isInvalid}>
                              <FieldLabel htmlFor={field.name}>
                                Description
                              </FieldLabel>
                              <Textarea
                                id={field.name}
                                name={field.name}
                                value={field.state.value}
                                onBlur={field.handleBlur}
                                onChange={(e) => {
                                  field.handleChange(e.target.value);
                                }}
                                aria-invalid={isInvalid}
                                placeholder="Market Description"
                              />
                            </Field>
                          );
                        }}
                      />
                      {/* Market base input, settlemt rules */}
                      <form.Field
                        name="marketBaseInput.settlementRules"
                        children={(field) => {
                          const isInvalid =
                            field.state.meta.isTouched &&
                            !field.state.meta.isValid;

                          return (
                            <Field data-invalid={isInvalid}>
                              <FieldLabel htmlFor={field.name}>
                                Description
                              </FieldLabel>
                              <Textarea
                                id={field.name}
                                name={field.name}
                                value={field.state.value}
                                onBlur={field.handleBlur}
                                onChange={(e) => {
                                  field.handleChange(e.target.value);
                                }}
                                aria-invalid={isInvalid}
                                placeholder="Market Settlement Rules"
                              />
                            </Field>
                          );
                        }}
                      />
                      {/* Market base input, outcomes */}
                      <form.Field
                        name="marketBaseInput.outcomes"
                        children={(field) => {
                          const isInvalid =
                            field.state.meta.isTouched &&
                            !field.state.meta.isValid;

                          return (
                            <Field data-invalid={isInvalid}>
                              <FieldLabel htmlFor={field.name}>
                                Outcomes
                              </FieldLabel>
                              <div className="flex items-center gap-2">
                                <Input
                                  name={field.name}
                                  id={field.name}
                                  placeholder="Outcome"
                                  value={singleOutcomeVal}
                                  onChange={(e) => {
                                    setSingleOutcomeVal(e.target.value);
                                  }}
                                />
                                <Button
                                  type="button"
                                  onClick={() => {
                                    field.handleChange([
                                      ...(field.state.value ?? []),
                                      {
                                        title: singleOutcomeVal,
                                        price: 0,
                                        volume: 0,
                                      },
                                    ]);
                                    setSingleOutcomeVal("");
                                  }}
                                >
                                  Add
                                </Button>
                              </div>
                            </Field>
                          );
                        }}
                      />
                      {/* Subcribing to market outcomes to show them in the ui */}
                      <form.Subscribe
                        selector={(state) =>
                          state.values.marketBaseInput.outcomes
                        }
                        children={(outcomes) => {
                          return (
                            <>
                              {outcomes.length !== 0 && (
                                <Card>
                                  <CardHeader>Outcomes</CardHeader>
                                  <CardContent>
                                    <ul>
                                      {outcomes.map((outcome, i) => (
                                        <li
                                          key={i}
                                          className="list-decimal capitalize"
                                        >
                                          {outcome.title}
                                        </li>
                                      ))}
                                    </ul>
                                  </CardContent>
                                </Card>
                              )}
                            </>
                          );
                        }}
                      />
                      {/* Market baseinput, market starts */}
                      <form.Field
                        name="marketBaseInput.marketStarts"
                        children={(field) => {
                          const isInvalid =
                            field.state.meta.isTouched &&
                            !field.state.meta.isValid;

                          return (
                            <FieldGroup className="mx-auto max-w-xs flex-row">
                              <Field>
                                <FieldLabel htmlFor="date-picker-optional">
                                  Date
                                </FieldLabel>
                                <Popover open={open} onOpenChange={setOpen}>
                                  <PopoverTrigger asChild>
                                    <Button
                                      variant="outline"
                                      id="date-picker-optional"
                                      className="w-32 justify-between font-normal"
                                    >
                                      {date
                                        ? format(date, "PPP")
                                        : "Select date"}
                                      <ChevronDownIcon />
                                    </Button>
                                  </PopoverTrigger>
                                  <PopoverContent
                                    className="w-auto overflow-hidden p-0"
                                    align="start"
                                  >
                                    <Calendar
                                      mode="single"
                                      selected={date}
                                      captionLayout="dropdown"
                                      defaultMonth={date}
                                      onSelect={(date) => {
                                        setDate(date);
                                        setOpen(false);
                                      }}
                                    />
                                  </PopoverContent>
                                </Popover>
                              </Field>
                              <Field className="w-32">
                                <FieldLabel htmlFor="time-picker-optional">
                                  Time
                                </FieldLabel>
                                <Input
                                  type="time"
                                  id="time-picker-optional"
                                  step="1"
                                  defaultValue="10:30:00"
                                  onChange={(e) => {
                                    console.log(e);
                                  }}
                                  className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                                />
                              </Field>
                            </FieldGroup>
                          );
                        }}
                      />
                    </>
                  )}
                </div>
              </FieldGroup>
            </form>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="preview">
        <Card>
          <CardHeader>
            <CardTitle>preview</CardTitle>
            <CardDescription>
              View your key metrics and recent project activity. Track progress
              across all your active projects.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-muted-foreground text-sm">
            You have 12 active projects and 3 pending tasks.
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
