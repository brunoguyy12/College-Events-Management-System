"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Users, Search, Edit, Shield, Crown, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { User as UserType } from "@prisma/client";

interface UserManagementProps {
  users: UserType[];
  currentUserId: string;
}

export function UserManagement({ users, currentUserId }: UserManagementProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
  const [newRole, setNewRole] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "ALL" || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleRoleChange = async () => {
    if (!selectedUser || !newRole) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/admin/users/${selectedUser.id}/role`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });

      if (response.ok) {
        toast({
          title: "Role Updated",
          description: `${selectedUser.name}'s role has been updated to ${newRole}.`,
        });
        setSelectedUser(null);
        setNewRole("");
        router.refresh();
      } else {
        const error = await response.json();
        throw new Error(error.message || "Failed to update role");
      }
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to update role. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getRoleIcon = (role: UserType["role"]) => {
    switch (role) {
      case "ADMIN":
        return <Crown className="h-4 w-4" />;
      case "ORGANIZER":
        return <Shield className="h-4 w-4" />;
      default:
        return <User className="h-4 w-4" />;
    }
  };

  const getRoleVariant = (role: UserType["role"]) => {
    switch (role) {
      case "ADMIN":
        return "default";
      case "ORGANIZER":
        return "secondary";
      default:
        return "outline";
    }
  };

  const roleStats = {
    total: users.length,
    students: users.filter((u) => u.role === "STUDENT").length,
    organizers: users.filter((u) => u.role === "ORGANIZER").length,
    admins: users.filter((u) => u.role === "ADMIN").length,
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Users
                </p>
                <p className="text-2xl font-bold">{roleStats.total}</p>
              </div>
              <Users className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Students
                </p>
                <p className="text-2xl font-bold">{roleStats.students}</p>
              </div>
              <User className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Organizers
                </p>
                <p className="text-2xl font-bold">{roleStats.organizers}</p>
              </div>
              <Shield className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Admins
                </p>
                <p className="text-2xl font-bold">{roleStats.admins}</p>
              </div>
              <Crown className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>User Directory</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Roles</SelectItem>
                <SelectItem value="STUDENT">Students</SelectItem>
                <SelectItem value="ORGANIZER">Organizers</SelectItem>
                <SelectItem value="ADMIN">Admins</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Users List */}
          <div className="space-y-3">
            {filteredUsers.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user.avatar || "/placeholder.svg"} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {user.email}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Joined {new Date(user.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge
                    variant={getRoleVariant(user.role)}
                    className="flex items-center gap-1"
                  >
                    {getRoleIcon(user.role)}
                    {user.role}
                  </Badge>
                  {user.id !== currentUserId && (
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedUser(user);
                            setNewRole(user.role);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Change User Role</DialogTitle>
                          <DialogDescription>
                            Update the role for {user.name}. This will change
                            their permissions immediately.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-12 w-12">
                              <AvatarImage
                                src={user.avatar || "/placeholder.svg"}
                              />
                              <AvatarFallback>
                                {user.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{user.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {user.email}
                              </p>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium">
                              New Role
                            </label>
                            <Select value={newRole} onValueChange={setNewRole}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="STUDENT">
                                  <div className="flex items-center gap-2">
                                    <User className="h-4 w-4" />
                                    Student
                                  </div>
                                </SelectItem>
                                <SelectItem value="ORGANIZER">
                                  <div className="flex items-center gap-2">
                                    <Shield className="h-4 w-4" />
                                    Organizer
                                  </div>
                                </SelectItem>
                                <SelectItem value="ADMIN">
                                  <div className="flex items-center gap-2">
                                    <Crown className="h-4 w-4" />
                                    Admin
                                  </div>
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button
                            variant="outline"
                            onClick={() => setSelectedUser(null)}
                          >
                            Cancel
                          </Button>
                          <Button
                            onClick={handleRoleChange}
                            disabled={isLoading || newRole === user.role}
                          >
                            {isLoading ? "Updating..." : "Update Role"}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  )}
                  {user.id === currentUserId && (
                    <Badge variant="outline" className="text-xs">
                      You
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No users found matching your criteria.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
