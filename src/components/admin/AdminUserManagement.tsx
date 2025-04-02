
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { 
  Card, 
  CardContent,
  CardHeader, 
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Search, UserCircle, UserCheck, UserX, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";

type UserWithProfile = {
  id: string;
  email?: string;
  created_at: string;
  profile: {
    first_name: string | null;
    last_name: string | null;
    is_premium: boolean | null;
    phone: string | null;
  };
  role: {
    role: string;
  };
};

const AdminUserManagement = () => {
  const [users, setUsers] = useState<UserWithProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserWithProfile | null>(null);
  const [editUserData, setEditUserData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    role: "",
  });
  
  useEffect(() => {
    fetchUsers();
  }, []);
  
  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      
      // Get all auth users with their profiles
      const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
      
      if (authError) throw authError;
      
      // Get all profiles
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("*");
        
      if (profilesError) throw profilesError;
      
      // Get all user roles
      const { data: roles, error: rolesError } = await supabase
        .from("user_roles")
        .select("*");
        
      if (rolesError) throw rolesError;
      
      // Combine the data
      const combinedUsers = authUsers.users.map(user => {
        const userProfile = profiles.find(profile => profile.id === user.id) || {
          first_name: null,
          last_name: null,
          is_premium: false,
          phone: null
        };
        
        const userRole = roles.find(role => role.user_id === user.id) || {
          role: "customer"
        };
        
        return {
          id: user.id,
          email: user.email,
          created_at: user.created_at,
          profile: userProfile,
          role: userRole
        };
      });
      
      setUsers(combinedUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to load users");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  const filteredUsers = users.filter(user => {
    const fullName = `${user.profile.first_name || ''} ${user.profile.last_name || ''}`.toLowerCase();
    const email = user.email?.toLowerCase() || '';
    const search = searchTerm.toLowerCase();
    
    return fullName.includes(search) || email.includes(search);
  });
  
  const handleEditUser = (user: UserWithProfile) => {
    setSelectedUser(user);
    setEditUserData({
      firstName: user.profile.first_name || "",
      lastName: user.profile.last_name || "",
      email: user.email || "",
      phone: user.profile.phone || "",
      role: user.role.role,
    });
    setEditDialogOpen(true);
  };
  
  const handleDeleteUser = (user: UserWithProfile) => {
    setSelectedUser(user);
    setDeleteDialogOpen(true);
  };
  
  const confirmDeleteUser = async () => {
    if (!selectedUser) return;
    
    try {
      setIsLoading(true);
      
      // Delete the user from Supabase Auth
      const { error } = await supabase.auth.admin.deleteUser(selectedUser.id);
      
      if (error) throw error;
      
      toast.success("User deleted successfully");
      setDeleteDialogOpen(false);
      await fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Failed to delete user");
    } finally {
      setIsLoading(false);
    }
  };
  
  const confirmEditUser = async () => {
    if (!selectedUser) return;
    
    try {
      setIsLoading(true);
      
      // Update profile data
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          first_name: editUserData.firstName,
          last_name: editUserData.lastName,
          phone: editUserData.phone,
        })
        .eq("id", selectedUser.id);
        
      if (profileError) throw profileError;
      
      // Update role if changed
      if (selectedUser.role.role !== editUserData.role) {
        const { error: roleError } = await supabase
          .from("user_roles")
          .update({ role: editUserData.role })
          .eq("user_id", selectedUser.id);
          
        if (roleError) throw roleError;
      }
      
      toast.success("User updated successfully");
      setEditDialogOpen(false);
      await fetchUsers();
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("Failed to update user");
    } finally {
      setIsLoading(false);
    }
  };
  
  if (isLoading && users.length === 0) {
    return (
      <div className="flex justify-center my-12">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-bold">User Management</CardTitle>
        <CardDescription>View and manage all registered users</CardDescription>
        <div className="flex items-center mt-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Search users..."
              className="pl-8"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6 text-gray-500">
                    No users found
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        <UserCircle className="h-6 w-6 mr-2 text-gray-400" />
                        {user.profile.first_name && user.profile.last_name 
                          ? `${user.profile.first_name} ${user.profile.last_name}`
                          : "No name provided"}
                      </div>
                    </TableCell>
                    <TableCell>{user.email || "No email"}</TableCell>
                    <TableCell>
                      <Badge variant={user.role.role === "admin" ? "destructive" : "secondary"}>
                        {user.role.role || "customer"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {user.profile.is_premium ? (
                        <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200">
                          Premium
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-gray-100 text-gray-800 border-gray-200">
                          Standard
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {new Date(user.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleEditUser(user)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleDeleteUser(user)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
      
      {/* Edit User Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Make changes to user information and role
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={editUserData.firstName}
                  onChange={(e) => setEditUserData({...editUserData, firstName: e.target.value})}
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={editUserData.lastName}
                  onChange={(e) => setEditUserData({...editUserData, lastName: e.target.value})}
                />
              </div>
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                value={editUserData.email}
                disabled
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={editUserData.phone}
                onChange={(e) => setEditUserData({...editUserData, phone: e.target.value})}
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="role">Role</Label>
              <select
                id="role"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={editUserData.role}
                onChange={(e) => setEditUserData({...editUserData, role: e.target.value})}
              >
                <option value="customer">Customer</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              type="button" 
              onClick={confirmEditUser} 
              disabled={isLoading}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete User Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this user? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-gray-500">
              This will permanently delete the user account for {selectedUser?.profile.first_name} {selectedUser?.profile.last_name} ({selectedUser?.email}).
            </p>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              type="button" 
              variant="destructive" 
              onClick={confirmDeleteUser}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              Delete User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default AdminUserManagement;
