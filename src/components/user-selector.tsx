import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

type User = {
  id: string;
  name: string;
};

export default function ChatHome() {
  const [Users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<string>("");
  const [isCreating, setIsCreating] = useState(false);
  const [newUserName, setNewUserName] = useState("");

  const apiUrl: string = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchUsers = async () => {
    const response = await fetch(`${apiUrl}/users`);
    const data = await response.json();
    setUsers(data);
  };

  const handleSelectUser = () => {
    if (selectedUser) {
      const user = Users.find((user) => user.name === selectedUser);
      if (user) {
        sessionStorage.setItem("user", user.name);
        navigate(`join-room`);
      }
    } else {
      toast({
        title: "Error",
        description: "Please select a user to join",
        variant: "destructive",
      });
    }
  };

  const handleCreateUser = async () => {
    if (newUserName.trim() === "") {
      toast({
        title: "Error",
        description: "User name cannot be empty",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: newUserName.trim() }),
      });

      if (!response.ok) {
        throw new Error("Failed to create user");
      }

      // Update Users state after successful API call
      fetchUsers()

      setSelectedUser(newUserName.trim());
      setIsCreating(false);
      setNewUserName("");

      toast({
        title: "Success",
        description: `User "${newUserName}" created successfully!`,
      });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an issue creating the user. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="h-screen flex flex-col justify-center items-center">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Select or Create a Chatuser
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!isCreating ? (
            <div className="space-y-4">
              <Label htmlFor="user-select">Select a User</Label>
              <Select value={selectedUser} onValueChange={setSelectedUser}>
                <SelectTrigger id="user-select">
                  <SelectValue placeholder="Choose a user" />
                </SelectTrigger>
                <SelectContent>
                  {Users.map((user) => (
                    <SelectItem key={user.id} value={user.name}>
                      {user.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button className="w-full" onClick={handleSelectUser}>
                Select User
              </Button>
              <div className="text-center">
                <Button variant="link" onClick={() => setIsCreating(true)}>
                  Or create a new user
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="new-user-name">New User Name</Label>
                <Input
                  id="new-user-name"
                  placeholder="Enter user name"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                />
              </div>
              <Button className="w-full" onClick={handleCreateUser}>
                Create User
              </Button>
              <div className="text-center">
                <Button variant="link" onClick={() => setIsCreating(false)}>
                  Back to user selection
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
