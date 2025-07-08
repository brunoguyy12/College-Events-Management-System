"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  UserCheck,
  Users,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface RoleRequest {
  id: string;
  requestedRole: string;
  reason: string;
  status: string;
  createdAt: Date;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    avatar: string | null;
  };
}

interface AdminRoleRequestsProps {
  requests: RoleRequest[];
}

export function AdminRoleRequests({ requests }: AdminRoleRequestsProps) {
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<RoleRequest | null>(
    null
  );
  const [adminNote, setAdminNote] = useState("");
  const router = useRouter();
  const { toast } = useToast();

  const handleRequestAction = async (
    requestId: string,
    action: "approve" | "reject"
  ) => {
    setIsLoading(requestId);
    try {
      const response = await fetch(`/api/role-requests/${requestId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          adminNote: adminNote || undefined,
        }),
      });

      if (response.ok) {
        toast({
          title: `Request ${action === "approve" ? "Approved" : "Rejected"}`,
          description: `The role request has been ${
            action === "approve" ? "approved" : "rejected"
          } successfully.`,
        });
        setSelectedRequest(null);
        setAdminNote("");
        router.refresh();
      } else {
        const error = await response.json();
        throw new Error(error.message || `Failed to ${action} request`);
      }
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : `Failed to ${action} request. Please try again.`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(null);
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

  const pendingRequests = requests.filter((req) => req.status === "PENDING");
  const processedRequests = requests.filter((req) => req.status !== "PENDING");

  return (
    <div className="space-y-6">
      {/* Pending Requests */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-yellow-500" />
            Pending Requests ({pendingRequests.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {pendingRequests.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <UserCheck className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No pending role requests</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingRequests.map((request) => (
                <div key={request.id} className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <Avatar className="h-10 w-10">
                        <AvatarImage
                          src={request.user.avatar || "/placeholder.svg"}
                        />
                        <AvatarFallback>
                          {request.user.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-2">
                        <div>
                          <h3 className="font-medium">{request.user.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {request.user.email}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{request.user.role}</Badge>
                          <span className="text-sm text-muted-foreground">
                            →
                          </span>
                          <Badge variant="default">
                            {request.requestedRole}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Requested on{" "}
                          {new Date(request.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedRequest(request)}
                            className="flex items-center gap-1"
                          >
                            <Eye className="h-4 w-4" />
                            Review
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Role Request Review</DialogTitle>
                            <DialogDescription>
                              Review and process the role request from{" "}
                              {request.user.name}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-12 w-12">
                                <AvatarImage
                                  src={
                                    request.user.avatar || "/placeholder.svg"
                                  }
                                />
                                <AvatarFallback>
                                  {request.user.name.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <h3 className="font-medium">
                                  {request.user.name}
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                  {request.user.email}
                                </p>
                                <div className="flex items-center gap-2 mt-1">
                                  <Badge variant="outline">
                                    {request.user.role}
                                  </Badge>
                                  <span className="text-sm text-muted-foreground">
                                    →
                                  </span>
                                  <Badge variant="default">
                                    {request.requestedRole}
                                  </Badge>
                                </div>
                              </div>
                            </div>

                            <div>
                              <Label className="text-sm font-medium">
                                Request Reason:
                              </Label>
                              <div className="mt-2 p-3 bg-muted rounded-lg text-sm">
                                {request.reason}
                              </div>
                            </div>

                            <div>
                              <Label htmlFor="adminNote">
                                Admin Note (Optional)
                              </Label>
                              <Textarea
                                id="adminNote"
                                value={adminNote}
                                onChange={(e) => setAdminNote(e.target.value)}
                                placeholder="Add a note for the user (optional)..."
                                rows={3}
                              />
                            </div>
                          </div>
                          <DialogFooter className="gap-2">
                            <Button
                              variant="destructive"
                              onClick={() =>
                                handleRequestAction(request.id, "reject")
                              }
                              disabled={isLoading === request.id}
                              className="flex items-center gap-1"
                            >
                              <XCircle className="h-4 w-4" />
                              {isLoading === request.id
                                ? "Rejecting..."
                                : "Reject"}
                            </Button>
                            <Button
                              onClick={() =>
                                handleRequestAction(request.id, "approve")
                              }
                              disabled={isLoading === request.id}
                              className="flex items-center gap-1"
                            >
                              <CheckCircle className="h-4 w-4" />
                              {isLoading === request.id
                                ? "Approving..."
                                : "Approve"}
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Processed Requests */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Recent Processed Requests ({processedRequests.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {processedRequests.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No processed requests yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {processedRequests.slice(0, 10).map((request) => (
                <div
                  key={request.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={request.user.avatar || "/placeholder.svg"}
                      />
                      <AvatarFallback>
                        {request.user.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-sm">{request.user.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {request.user.role} → {request.requestedRole}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={getStatusVariant(request.status)}
                      className="flex items-center gap-1"
                    >
                      {getStatusIcon(request.status)}
                      {request.status}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {new Date(request.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
