import "./App.css";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "./components/ui/toaster";
import ChatRoomSelector from "./components/chatroom-selector";
import ChatRoom from "./components/chatroom";
import ChatHome from "./components/user-selector";

function App() {
  return (
    <div >
      <Toaster/>
      <Routes >
        <Route path="/rails-chat-fe" >
          <Route index element={<ChatHome />} />
          <Route path="join-room" element={<ChatRoomSelector />} />
          <Route path="chatrooms/:id" element={<ChatRoom />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
