// store/socketSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Socket } from "socket.io-client";
import io from "socket.io-client";
import { AppDispatch, RootState } from "./index";
import toast from "react-hot-toast";
import { jwtDecode } from "jwt-decode";

interface SocketState {
  socket: Socket | null;
  lastMessage: any | null;
}

const initialState: SocketState = {
  socket: null,
  lastMessage: null,
};

const socketSlice = createSlice({
  name: "socket",
  initialState,
  reducers: {
    setSocket: (state, action: PayloadAction<Socket | null>) => {
      state.socket = action.payload;
    },
    setLastMessage: (state, action: PayloadAction<any>) => {
      state.lastMessage = action.payload;
    },
  },
});

export const { setSocket, setLastMessage } = socketSlice.actions;

export const initializeSocket =
  (token: string) => (dispatch: AppDispatch, getState: () => RootState) => {
    // Add getState
    const CHAT_SERVER_URL =
      process.env.NEXT_PUBLIC_CHAT_SOCKET_URL || "http://localhost:5005";
    const newSocket = io(CHAT_SERVER_URL, {
      auth: { token },
      transports: ["websocket", "polling"],
    });

    newSocket.on("connect", () => {
      console.log("Connected to chat server");
    });

    newSocket.on("connect_error", (error) => {
      console.error("Connection error:", error);
    });

    newSocket.on("disconnect", (reason) => {
      console.log("Disconnected from chat server:", reason);
    });

    newSocket.on("notify", (msg) => {
      console.log("New Message socketSlice : ", msg);
      console.log("New Message socketSlicemessage : ", msg.message);

      toast.custom(
        (t) => (
          <div
            className={`${
              t.visible ? "animate-enter" : "animate-leave"
            } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
          >
            <div className="flex-1 w-0 p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 pt-0.5">
                  <img
                    className="h-10 w-10 rounded-full"
                    src={
                      msg?.senderInfo?.image === ""
                        ? "/defaultUserImage.png"
                        : msg?.senderInfo?.image
                    }
                    alt={msg?.senderInfo?.username || "User"}
                  />
                </div>
                <div className="ml-3 flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {msg?.senderInfo?.username}
                  </p>
                  <p className="mt-1 text-sm text-gray-500">{msg?.content}</p>
                </div>
              </div>
            </div>
            <div className="flex border-l border-gray-200">
              <button
                onClick={() => toast.dismiss(t.id)}
                className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                Close
              </button>
            </div>
          </div>
        ),
        { duration: 1500 }
      );
    });

    dispatch(setSocket(newSocket));
  };

export default socketSlice.reducer;
