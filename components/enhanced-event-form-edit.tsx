"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Plus, Trash2, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  DEPARTMENTS,
  getDepartmentColor,
  getDepartmentsByCategory,
  Department,
} from "@/lib/departments";
import { formatDateForInput, parseInputDate } from "@/lib/timezone";
import { GenericImageUpload } from "@/components/generic-image-upload";

const eventSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  category: z.string().min(1, "Category is required"),
  department: z.nativeEnum(Department, {
    required_error: "Department is required",
  }),
  venue: z.string().min(1, "Venue is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  capacity: z.number().min(1, "Capacity must be at least 1"),
  price: z.number().min(0, "Price cannot be negative"),
  imageUrl: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

type EventFormData = z.infer<typeof eventSchema>;

interface Speaker {
  name: string;
  bio: string;
  expertise: string;
  linkedIn?: string;
}

interface AgendaItem {
  time: string;
  title: string;
  description: string;
  speaker?: string;
}

interface Prize {
  position: string;
  amount: string;
  description: string;
}

interface FAQ {
  question: string;
  answer: string;
}

export interface EnhancedEditEventFormProps {
  event: {
    id: string;
    title: string;
    description: string;
    category: string;
    department: string;
    venue: string;
    startDate: Date;
    endDate: Date;
    capacity: number;
    price: number;
    imageUrl: string | null;
    tags?: string[];
    speakers?: any[];
    agenda?: any[];
    prizes?: any[];
    rules?: any[];
    requirements?: any[];
    faqs?: any[];
    _count: {
      registrations: number;
    };
  };
  userId: string;
}

export function EnhancedEditEventForm({
  event,
  userId,
}: EnhancedEditEventFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [currentTag, setCurrentTag] = useState("");
  const [tags, setTags] = useState<string[]>(event.tags || []);
  const [speakers, setSpeakers] = useState<Speaker[]>(event.speakers || []);
  const [agenda, setAgenda] = useState<AgendaItem[]>(event.agenda || []);
  const [prizes, setPrizes] = useState<Prize[]>(event.prizes || []);
  const [faqs, setFaqs] = useState<FAQ[]>(event.faqs || []);
  const [rules, setRules] = useState<string[]>(event.rules || []);
  const [requirements, setRequirements] = useState<string[]>(
    event.requirements || []
  );

  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: event.title,
      description: event.description,
      category: event.category,
      department: event.department as Department,
      venue: event.venue,
      startDate: formatDateForInput(event.startDate),
      endDate: formatDateForInput(event.endDate),
      capacity: event.capacity,
      price: event.price,
      imageUrl: event.imageUrl || "",
      tags: event.tags || [],
    },
  });

  const selectedCategory = form.watch("category");
  const selectedDepartment = form.watch("department");
  const departmentsByCategory = getDepartmentsByCategory();
  const hasRegistrations = event._count.registrations > 0;

  // All the same helper functions from create form...
  const addTag = () => {
    if (currentTag.trim() && !tags.includes(currentTag.trim())) {
      setTags([...tags, currentTag.trim()]);
      setCurrentTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const addSpeaker = () => {
    setSpeakers([
      ...speakers,
      { name: "", bio: "", expertise: "", linkedIn: "" },
    ]);
  };

  const updateSpeaker = (
    index: number,
    field: keyof Speaker,
    value: string
  ) => {
    const updated = [...speakers];
    updated[index] = { ...updated[index], [field]: value };
    setSpeakers(updated);
  };

  const removeSpeaker = (index: number) => {
    setSpeakers(speakers.filter((_, i) => i !== index));
  };

  const addAgendaItem = () => {
    setAgenda([
      ...agenda,
      { time: "", title: "", description: "", speaker: "" },
    ]);
  };

  const updateAgendaItem = (
    index: number,
    field: keyof AgendaItem,
    value: string
  ) => {
    const updated = [...agenda];
    updated[index] = { ...updated[index], [field]: value };
    setAgenda(updated);
  };

  const removeAgendaItem = (index: number) => {
    setAgenda(agenda.filter((_, i) => i !== index));
  };

  const addPrize = () => {
    setPrizes([...prizes, { position: "", amount: "", description: "" }]);
  };

  const updatePrize = (index: number, field: keyof Prize, value: string) => {
    const updated = [...prizes];
    updated[index] = { ...updated[index], [field]: value };
    setPrizes(updated);
  };

  const removePrize = (index: number) => {
    setPrizes(prizes.filter((_, i) => i !== index));
  };

  const addFAQ = () => {
    setFaqs([...faqs, { question: "", answer: "" }]);
  };

  const updateFAQ = (index: number, field: keyof FAQ, value: string) => {
    const updated = [...faqs];
    updated[index] = { ...updated[index], [field]: value };
    setFaqs(updated);
  };

  const removeFAQ = (index: number) => {
    setFaqs(faqs.filter((_, i) => i !== index));
  };

  const addRule = () => {
    setRules([...rules, ""]);
  };

  const updateRule = (index: number, value: string) => {
    const updated = [...rules];
    updated[index] = value;
    setRules(updated);
  };

  const removeRule = (index: number) => {
    setRules(rules.filter((_, i) => i !== index));
  };

  const addRequirement = () => {
    setRequirements([...requirements, ""]);
  };

  const updateRequirement = (index: number, value: string) => {
    const updated = [...requirements];
    updated[index] = value;
    setRequirements(updated);
  };

  const removeRequirement = (index: number) => {
    setRequirements(requirements.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: EventFormData) => {
    setIsLoading(true);
    try {
      // Parse dates with proper timezone handling
      const startDate = parseInputDate(data.startDate);
      const endDate = parseInputDate(data.endDate);

      // Validate dates
      if (startDate >= endDate) {
        toast({
          title: "Invalid Dates",
          description: "End date must be after start date.",
          variant: "destructive",
        });
        return;
      }

      const eventData = {
        ...data,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        tags,
        speakers: speakers.length > 0 ? speakers : null,
        agenda: agenda.length > 0 ? agenda : null,
        prizes: prizes.length > 0 ? prizes : null,
        faqs: faqs.length > 0 ? faqs : null,
        rules: rules.length > 0 ? rules : null,
        requirements: requirements.length > 0 ? requirements : null,
      };

      const response = await fetch(`/api/events/${event.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(eventData),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Event updated successfully!",
        });
        router.push(`/events/${event.id}`);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update event");
      }
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to update event. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderCategorySpecificFields = () => {
    // Same as create form...
    switch (selectedCategory) {
      case "SEMINAR":
      case "CONFERENCE":
        return (
          <div className="space-y-6">
            {/* Speakers Section - same as create form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Speakers
                  <Button type="button" onClick={addSpeaker} size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Speaker
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {speakers.map((speaker, index) => (
                  <div key={index} className="p-4 border rounded-lg space-y-3">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">Speaker {index + 1}</h4>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeSpeaker(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="grid gap-3 md:grid-cols-2">
                      <Input
                        placeholder="Speaker name"
                        value={speaker.name}
                        onChange={(e) =>
                          updateSpeaker(index, "name", e.target.value)
                        }
                      />
                      <Input
                        placeholder="Expertise area"
                        value={speaker.expertise}
                        onChange={(e) =>
                          updateSpeaker(index, "expertise", e.target.value)
                        }
                      />
                    </div>
                    <Textarea
                      placeholder="Speaker bio"
                      value={speaker.bio}
                      onChange={(e) =>
                        updateSpeaker(index, "bio", e.target.value)
                      }
                    />
                    <Input
                      placeholder="LinkedIn profile (optional)"
                      value={speaker.linkedIn}
                      onChange={(e) =>
                        updateSpeaker(index, "linkedIn", e.target.value)
                      }
                    />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Agenda Section - same as create form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Agenda
                  <Button type="button" onClick={addAgendaItem} size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Item
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {agenda.map((item, index) => (
                  <div key={index} className="p-4 border rounded-lg space-y-3">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">Agenda Item {index + 1}</h4>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeAgendaItem(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="grid gap-3 md:grid-cols-3">
                      <Input
                        placeholder="Time (e.g., 10:00 AM)"
                        value={item.time}
                        onChange={(e) =>
                          updateAgendaItem(index, "time", e.target.value)
                        }
                      />
                      <Input
                        placeholder="Session title"
                        value={item.title}
                        onChange={(e) =>
                          updateAgendaItem(index, "title", e.target.value)
                        }
                      />
                      <Input
                        placeholder="Speaker (optional)"
                        value={item.speaker}
                        onChange={(e) =>
                          updateAgendaItem(index, "speaker", e.target.value)
                        }
                      />
                    </div>
                    <Textarea
                      placeholder="Session description"
                      value={item.description}
                      onChange={(e) =>
                        updateAgendaItem(index, "description", e.target.value)
                      }
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        );

      case "HACKATHON":
      case "SPORTS":
        return (
          <div className="space-y-6">
            {/* Prizes and Rules sections - same as create form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Prizes
                  <Button type="button" onClick={addPrize} size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Prize
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {prizes.map((prize, index) => (
                  <div key={index} className="p-4 border rounded-lg space-y-3">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">Prize {index + 1}</h4>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removePrize(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="grid gap-3 md:grid-cols-3">
                      <Input
                        placeholder="Position (e.g., 1st Place)"
                        value={prize.position}
                        onChange={(e) =>
                          updatePrize(index, "position", e.target.value)
                        }
                      />
                      <Input
                        placeholder="Amount (e.g., ₹10,000)"
                        value={prize.amount}
                        onChange={(e) =>
                          updatePrize(index, "amount", e.target.value)
                        }
                      />
                    </div>
                    <Textarea
                      placeholder="Prize description"
                      value={prize.description}
                      onChange={(e) =>
                        updatePrize(index, "description", e.target.value)
                      }
                    />
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Rules & Regulations
                  <Button type="button" onClick={addRule} size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Rule
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {rules.map((rule, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      placeholder={`Rule ${index + 1}`}
                      value={rule}
                      onChange={(e) => updateRule(index, e.target.value)}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeRule(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        );

      case "WORKSHOP":
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Prerequisites & Requirements
                  <Button type="button" onClick={addRequirement} size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Requirement
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {requirements.map((req, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      placeholder={`Requirement ${index + 1}`}
                      value={req}
                      onChange={(e) => updateRequirement(index, e.target.value)}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeRequirement(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {hasRegistrations && (
        <Card className="border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-yellow-800 dark:text-yellow-200">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-sm font-medium">
                This event has {event._count.registrations} registered
                participants. Some changes may affect them.
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Edit Event
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="basic" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="basic">Basic Details</TabsTrigger>
              <TabsTrigger value="rich">Rich Content</TabsTrigger>
              <TabsTrigger value="additional">Additional Info</TabsTrigger>
            </TabsList>

            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <TabsContent value="basic" className="space-y-4">
                {/* Same basic form fields as create form but with defaultValues */}
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="title">Event Title</Label>
                    <Input
                      id="title"
                      {...form.register("title")}
                      placeholder="Enter event title"
                    />
                    {form.formState.errors.title && (
                      <p className="text-sm text-red-500">
                        {form.formState.errors.title.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={form.watch("category")}
                      onValueChange={(value) =>
                        form.setValue("category", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="SEMINAR">Seminar</SelectItem>
                        <SelectItem value="WORKSHOP">Workshop</SelectItem>
                        <SelectItem value="HACKATHON">Hackathon</SelectItem>
                        <SelectItem value="FEST">Fest</SelectItem>
                        <SelectItem value="CONFERENCE">Conference</SelectItem>
                        <SelectItem value="SPORTS">Sports</SelectItem>
                        <SelectItem value="CULTURAL">Cultural</SelectItem>
                        <SelectItem value="ACADEMIC">Academic</SelectItem>
                        <SelectItem value="OTHER">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Select
                    value={form.watch("department")}
                    onValueChange={(value) =>
                      form.setValue("department", value as Department)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select organizing department" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(departmentsByCategory).map(
                        ([category, depts]) => (
                          <div key={category}>
                            <div className="px-2 py-1.5 text-sm font-semibold text-muted-foreground">
                              {category}
                            </div>
                            {depts.map((dept) => (
                              <SelectItem key={dept.name} value={dept.name}>
                                <div className="flex items-center gap-2">
                                  <div
                                    className="w-3 h-3 rounded-full"
                                    style={{ backgroundColor: dept.color }}
                                  />
                                  {dept.displayName}
                                </div>
                              </SelectItem>
                            ))}
                          </div>
                        )
                      )}
                    </SelectContent>
                  </Select>
                  {selectedDepartment && (
                    <Badge
                      variant="secondary"
                      style={{
                        backgroundColor:
                          getDepartmentColor(selectedDepartment) + "20",
                        color: getDepartmentColor(selectedDepartment),
                        borderColor: getDepartmentColor(selectedDepartment),
                      }}
                    >
                      {
                        DEPARTMENTS.find((d) => d.name === selectedDepartment)
                          ?.displayName
                      }
                    </Badge>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    {...form.register("description")}
                    placeholder="Describe your event..."
                    rows={4}
                  />
                  {form.formState.errors.description && (
                    <p className="text-sm text-red-500">
                      {form.formState.errors.description.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Event Banner</Label>
                  <GenericImageUpload
                    value={form.watch("imageUrl") || ""}
                    onChange={(url) => form.setValue("imageUrl", url)}
                    onRemove={() => form.setValue("imageUrl", "")}
                    folder="event-banners"
                    placeholder="Upload event banner"
                    aspectRatio="video"
                    maxSize={10}
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="venue">Venue</Label>
                    <Input
                      id="venue"
                      {...form.register("venue")}
                      placeholder="Event venue"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="capacity">
                      Capacity
                      {hasRegistrations && (
                        <Badge variant="secondary" className="ml-2">
                          {event._count.registrations} registered
                        </Badge>
                      )}
                    </Label>
                    <Input
                      id="capacity"
                      type="number"
                      {...form.register("capacity", { valueAsNumber: true })}
                      placeholder="Maximum attendees"
                      min={event._count.registrations} // Can't reduce below current registrations
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Start Date & Time (IST)</Label>
                    <Input
                      id="startDate"
                      type="datetime-local"
                      {...form.register("startDate")}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="endDate">End Date & Time (IST)</Label>
                    <Input
                      id="endDate"
                      type="datetime-local"
                      {...form.register("endDate")}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price">Price (₹)</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    {...form.register("price", { valueAsNumber: true })}
                    placeholder="0.00"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Tags</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add a tag"
                      value={currentTag}
                      onChange={(e) => setCurrentTag(e.target.value)}
                      onKeyDown={(e) =>
                        e.key === "Enter" && (e.preventDefault(), addTag())
                      }
                    />
                    <Button type="button" onClick={addTag}>
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="flex items-center gap-1"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="ml-1 hover:text-red-500"
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="rich" className="space-y-4">
                {selectedCategory ? (
                  renderCategorySpecificFields()
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    Please select an event category first to see relevant
                    fields.
                  </div>
                )}
              </TabsContent>

              <TabsContent value="additional" className="space-y-4">
                {/* FAQs Section */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      Frequently Asked Questions
                      <Button type="button" onClick={addFAQ} size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Add FAQ
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {faqs.map((faq, index) => (
                      <div
                        key={index}
                        className="p-4 border rounded-lg space-y-3"
                      >
                        <div className="flex justify-between items-center">
                          <h4 className="font-medium">FAQ {index + 1}</h4>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeFAQ(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <Input
                          placeholder="Question"
                          value={faq.question}
                          onChange={(e) =>
                            updateFAQ(index, "question", e.target.value)
                          }
                        />
                        <Textarea
                          placeholder="Answer"
                          value={faq.answer}
                          onChange={(e) =>
                            updateFAQ(index, "answer", e.target.value)
                          }
                        />
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              <div className="flex gap-4">
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Updating..." : "Update Event"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
