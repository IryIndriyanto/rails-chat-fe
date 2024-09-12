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
import { Loader2 } from "lucide-react";

type Chatroom = {
  id: string;
  name: string;
};

export default function ChatRoomSelector() {
  const [chatrooms, setChatrooms] = useState<Chatroom[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<string>("");
  const [isCreating, setIsCreating] = useState(false);
  const [newRoomName, setNewRoomName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const apiUrl: string = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  useEffect(() => {
    fetchChatrooms();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchChatrooms = async () => {
    const response = await fetch(`${apiUrl}/chatrooms`);
    const data = await response.json();
    setChatrooms(data);
  };

  const handleJoinRoom = () => {
    if (selectedRoom) {
      const room = chatrooms.find((room) => room.name === selectedRoom);
      if (room) {
        navigate(`/rails-chat-fe/chatrooms/${room.id}`);
      }
    } else {
      toast({
        title: "Error",
        description: "Please select a room to join",
        variant: "destructive",
      });
    }
  };

  const handleCreateRoom = async () => {
    if (newRoomName.trim() === "") {
      toast({
        title: "Error",
        description: "Room name cannot be empty",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${apiUrl}/chatrooms`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: newRoomName.trim() }),
      });

      if (!response.ok) {
        throw new Error("Failed to create room");
      }

      // Update chatrooms state after successful API call
      fetchChatrooms();

      setSelectedRoom(newRoomName.trim());
      setIsCreating(false);
      setIsLoading(false);
      setNewRoomName("");

      toast({
        title: "Success",
        description: `Room "${newRoomName}" created successfully!`,
      });
      setIsLoading(false);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an issue creating the room. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="h-screen flex flex-col justify-center items-center">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Join or Create a Chatroom
          </CardTitle>
          <div className="text-lg">{`👋 Hello, ${sessionStorage.getItem(
            "username"
          )}`}</div>
        </CardHeader>
        <CardContent className="space-y-4">
          {!isCreating ? (
            <div className="space-y-4">
              <Label htmlFor="room-select">Select a Chatroom</Label>
              <Select value={selectedRoom} onValueChange={setSelectedRoom}>
                <SelectTrigger id="room-select">
                  <SelectValue placeholder="Choose a room" />
                </SelectTrigger>
                <SelectContent>
                  {chatrooms.map((room) => (
                    <SelectItem key={room.id} value={room.name}>
                      {room.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button className="w-full" onClick={handleJoinRoom}>
                Join Room
              </Button>
              <div className="text-center">
                <Button variant="link" onClick={() => setIsCreating(true)}>
                  Or create a new room
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="new-room-name">New Room Name</Label>
                <Input
                  id="new-room-name"
                  placeholder="Enter room name"
                  value={newRoomName}
                  onChange={(e) => setNewRoomName(e.target.value)}
                />
              </div>
              <Button
                className="w-full"
                onClick={handleCreateRoom}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  "Create Room"
                )}
              </Button>
              <div className="text-center">
                <Button variant="link" onClick={() => setIsCreating(false)}>
                  Back to room selection
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
