import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { SetStateAction, useEffect, useState } from "react";

const apiUrl: string = import.meta.env.VITE_API_URL;
const wsUrl: string = import.meta.env.VITE_WS_URL;

interface Message {
  id: number;
  body: string;
  created_at: string;
}

const ws = new WebSocket(wsUrl);
export default function Chatroom() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [guid, setGuid] = useState("");
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const messagesContainer = document.getElementById("messages");

  ws.onopen = () => {
    console.log("connected to message server");
    setGuid(Math.random().toString(36).substring(2, 15));

    ws.send(
      JSON.stringify({
        command: "subscribe",
        identifier: JSON.stringify({
          id: guid,
          channel: "MessagesChannel",
        }),
      })
    );
  };

  ws.onmessage = (e) => {
    const data = JSON.parse(e.data);
    if (
      data.type === "ping" ||
      data.type === "welcome" ||
      data.type === "confirm_subscription"
    )
      return;

    const message = data.message;

    setMessages((prevMessages) => [...prevMessages, message]);
  };

  useEffect(() => {
    fetchMessages();
    resetScroll();
  }, []);

  useEffect(() => {
    if (!isFirstLoad) {
      resetScrollAnimated();
    } else {
      resetScroll();
    }
  }, [messages]);

  const fetchMessages = async () => {
    const response = await fetch(`${apiUrl}/messages`);
    const data = await response.json();
    setMessagesAndScrollDown(data);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsFirstLoad(false);

    const body = (e.target as HTMLFormElement).message.value;
    (e.target as HTMLFormElement).message.value = "";

    await fetch(`${apiUrl}/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ body }),
    });
  };

  const setMessagesAndScrollDown = (data: SetStateAction<Message[]>) => {
    setMessages(data);
    resetScroll();
  };

  const resetScroll = () => {
    if (!messagesContainer) return;
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  };

  const resetScrollAnimated = () => {
    if (!messagesContainer) return;
    messagesContainer.scrollTo({
      top: messagesContainer.scrollHeight,
      behavior: "smooth",
    });
  };

  function getAvatarFallback(username: string): string {
    const parts = username.trim().split(" ");
    if (parts.length > 1) {
      // Use the first letter of the first name and the first letter of the last name
      return `${parts[0][0].toUpperCase()}${parts[1][0].toUpperCase()}`;
    }
    // Use the first two letters of the username if it's a single word
    return username.slice(0, 2).toUpperCase();
  }

  function formatChatDate(isoString: string): string {
    const date = new Date(isoString);
    const formatter = new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });

    // Format the date in 'MM/DD/YYYY' and time in 'HH:MM AM/PM' format
    const datePart = date.toLocaleDateString("en-US");
    const timePart = formatter.format(date);

    return `${datePart} at ${timePart}`;
  }

  return (
    <div className="flex flex-col h-screen">
      <header className="bg-primary text-primary-foreground py-4 px-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Avatar className="w-8 h-8 border">
            <AvatarImage src="/placeholder-user.jpg" alt="Image" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">Chatroom</div>
            <div className="text-sm text-muted-foreground">5 online</div>
          </div>
        </div>
      </header>

      <div id="messages" className="flex-1 overflow-auto p-6 space-y-4">
        {messages.length === 0 ? (
          <p>No messages yet</p>
        ) : (
          messages.map((message) => (
            <div className="flex items-start gap-4" key={message.id}>
              <Avatar className="w-12 h-12 border">
                <AvatarImage src="/placeholder-user.jpg" alt="Image" />
                <AvatarFallback>{`${getAvatarFallback(
                  "iry in"
                )}`}</AvatarFallback>
              </Avatar>
              <div className="grid gap-1">
                <div className="flex items-center gap-2">
                  <div className="font-medium">{guid}</div>
                  <div className="text-xs text-muted-foreground">
                    {formatChatDate(message.created_at)}
                  </div>
                </div>
                <div className="bg-muted rounded-md p-3 text-sm w-fit">
                  {message.body}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="bg-background border-t px-6 py-4">
        <form className="relative" onSubmit={handleSubmit}>
          <Textarea
            placeholder="Type your message..."
            name="message"
            id="message"
            rows={1}
            className="min-h-[48px] rounded-2xl resize-none p-4 border border-neutral-400 shadow-sm pr-16"
          />
          <Button
            type="submit"
            size="icon"
            className="absolute w-8 h-8 top-3 right-3"
          >
            <SendIcon className="w-4 h-4" />
            <span className="sr-only">Send</span>
          </Button>
        </form>
      </div>
    </div>
  );
}

function SendIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m22 2-7 20-4-9-9-4Z" />
      <path d="M22 2 11 13" />
    </svg>
  );
}
