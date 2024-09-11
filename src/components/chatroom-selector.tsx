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

type Chatroom = {
  id: string;
  name: string;
};

export default function ChatHome() {
  const [chatrooms, setChatrooms] = useState<Chatroom[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<string>("");
  const [isCreating, setIsCreating] = useState(false);
  const [newRoomName, setNewRoomName] = useState("");

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
      const room = chatrooms.find((room) => room.id === selectedRoom);
      if (room) {
        navigate(`chatrooms/${room.id}`);
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

    const newRoom: Chatroom = {
      id: (chatrooms.length + 1).toString(),
      name: newRoomName.trim(),
    };

    try {
      const response = await fetch(`${apiUrl}/chatrooms`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newRoom),
      });

      if (!response.ok) {
        throw new Error("Failed to create room");
      }

      // Update chatrooms state after successful API call
      setChatrooms([...chatrooms, newRoom]);
      setSelectedRoom(newRoom.id);
      setIsCreating(false);
      setNewRoomName("");

      toast({
        title: "Success",
        description: `Room "${newRoom.name}" created successfully!`,
      });
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
                    <SelectItem key={room.id} value={room.id}>
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
              <Button className="w-full" onClick={handleCreateRoom}>
                Create Room
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
