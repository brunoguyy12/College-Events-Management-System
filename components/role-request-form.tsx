"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import { UserCheck, Clock, CheckCircle, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const roleRequestSchema = z.object({
  requestedRole: z.enum(["ORGANIZER", "ADMIN"]),
  reason: z
    .string()
    .min(
      50,
      "Please provide at least 50 characters explaining why you need this role"
    ),
});

type RoleRequestFormData = z.infer<typeof roleRequestSchema>;

interface RoleRequestFormProps {
  userId: string;
  currentRole: string;
  existingRequest?: {
    id: string;
    requestedRole: string;
    reason: string;
    status: string;
    createdAt: Date;
  } | null;
}

export function RoleRequestForm({
  userId,
  currentRole,
  existingRequest,
}: RoleRequestFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<RoleRequestFormData>({
    resolver: zodResolver(roleRequestSchema),
    defaultValues: {
      requestedRole: "ORGANIZER",
      reason: "",
    },
  });

  const onSubmit = async (data: RoleRequestFormData) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/role-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        toast({
          title: "Request Submitted",
          description: "Your role request has been submitted for admin review.",
        });
        router.refresh();
      } else {
        const error = await response.json();
        throw new Error(error.message || "Failed to submit request");
      }
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to submit request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "PENDING":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case "APPROVED":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "REJECTED":
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "PENDING":
        return "secondary" as const;
      case "APPROVED":
        return "default" as const;
      case "REJECTED":
        return "destructive" as const;
      default:
        return "secondary" as const;
    }
  };

  if (currentRole !== "STUDENT") {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCheck className="h-5 w-5" />
            Role Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <Badge variant="default" className="text-lg px-4 py-2">
              {currentRole}
            </Badge>
            <p className="text-muted-foreground mt-2">
              You already have elevated permissions.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserCheck className="h-5 w-5" />
          Request Role Upgrade
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {existingRequest ? (
          <div className="space-y-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium">Existing Request</h3>
                <Badge
                  variant={getStatusVariant(existingRequest.status)}
                  className="flex items-center gap-1"
                >
                  {getStatusIcon(existingRequest.status)}
                  {existingRequest.status}
                </Badge>
              </div>
              <div className="space-y-2 text-sm">
                <p>
                  <span className="font-medium">Requested Role:</span>{" "}
                  {existingRequest.requestedRole}
                </p>
                <p>
                  <span className="font-medium">Submitted:</span>{" "}
                  {new Date(existingRequest.createdAt).toLocaleDateString()}
                </p>
                <p>
                  <span className="font-medium">Reason:</span>
                </p>
                <p className="text-muted-foreground bg-muted p-2 rounded">
                  {existingRequest.reason}
                </p>
              </div>
            </div>

            {existingRequest.status === "REJECTED" && (
              <div className="text-center">
                <p className="text-muted-foreground mb-4">
                  Your previous request was rejected. You can submit a new
                  request.
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    // Reset form to allow new request
                    window.location.reload();
                  }}
                >
                  Submit New Request
                </Button>
              </div>
            )}

            {existingRequest.status === "PENDING" && (
              <div className="text-center text-muted-foreground">
                <p>
                  Your request is being reviewed by administrators. Please wait
                  for approval.
                </p>
              </div>
            )}
          </div>
        ) : (
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="requestedRole">Requested Role</Label>
              <Select
                onValueChange={(value) =>
                  form.setValue("requestedRole", value as "ORGANIZER" | "ADMIN")
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ORGANIZER">
                    <div className="space-y-1">
                      <div className="font-medium">Event Organizer</div>
                      <div className="text-xs text-muted-foreground">
                        Create and manage events
                      </div>
                    </div>
                  </SelectItem>
                  <SelectItem value="ADMIN">
                    <div className="space-y-1">
                      <div className="font-medium">Administrator</div>
                      <div className="text-xs text-muted-foreground">
                        Full platform management access
                      </div>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reason">Reason for Request</Label>
              <Textarea
                id="reason"
                {...form.register("reason")}
                placeholder="Please explain why you need this role, your experience, and how you plan to use these permissions..."
                rows={6}
              />
              {form.formState.errors.reason && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.reason.message}
                </p>
              )}
            </div>

            <div className="bg-muted p-4 rounded-lg text-sm">
              <h4 className="font-medium mb-2">What happens next?</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Your request will be reviewed by administrators</li>
                <li>• You'll receive a notification when it's processed</li>
                <li>• If approved, your role will be updated automatically</li>
                <li>
                  • If rejected, you can submit a new request with more details
                </li>
              </ul>
            </div>

            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? "Submitting Request..." : "Submit Role Request"}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
