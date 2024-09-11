import "./App.css";
import { Routes, Route, Outlet, Link } from "react-router-dom";
import { Toaster } from "./components/ui/toaster";
import ChatHome from "./components/chatroom-selector";
import ChatRoom from "./components/chatroom";

function App() {
  return (
    <div >
      <Toaster/>
      <Routes >
        <Route path="/rails-chat-fe" >
          <Route index element={<ChatHome />} />
          <Route path="chatrooms/:id" element={<ChatRoom />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
