import { createSlice, PayloadAction, ThunkAction } from '@reduxjs/toolkit';
import { Socket } from 'socket.io-client';
import io from 'socket.io-client';
import { AppDispatch, RootState } from './index';
import toast from 'react-hot-toast';

interface CustomSocket extends Socket {
  receiveBuffer: any[];
}

interface SocketState {
  socket: CustomSocket | null;
  lastMessage: any | null;
}

const initialState: SocketState = {
  socket: null,
  lastMessage: null,
};

const socketSlice = createSlice({
  name: 'socket',
  initialState,
  reducers: {
    setSocket: (state, action: PayloadAction<CustomSocket | null>) => {
      state.socket = action.payload;
    },
    setLastMessage: (state, action: PayloadAction<any>) => {
      state.lastMessage = action.payload;
    },
  },
});

export const { setSocket, setLastMessage } = socketSlice.actions;

export const initializeSocket = (
  token: string
): ThunkAction<
  void,
  RootState,
  undefined,
  PayloadAction<CustomSocket | null>
> => {
  return (dispatch: AppDispatch, getState: () => RootState) => {
    const newSocket = io('https://backend.aswanth.online/chat', {
      path: '/socket.io',
      transports: ['websocket'],
      auth: { token },
      withCredentials: true,
    });

    newSocket.on('connect', () => {
      console.log('Connected to chat server');
    });

    newSocket.on('connect_error', (error) => {
      console.error('Connection error:', error);
    });

    newSocket.on('disconnect', (reason) => {
      console.log('Disconnected from chat server:', reason);
    });

    newSocket.on('notify', (msg) => {
      console.log('New Message socketSlice : ', msg);
      toast.custom(
        (t) => (
          <div
            className={`${
              t.visible ? 'animate-enter' : 'animate-leave'
            } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
          >
            <div className="flex-1 w-0 p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 pt-0.5">
                  <img
                    className="h-10 w-10 rounded-full"
                    src={
                      msg?.senderInfo?.image === ''
                        ? '/defaultUserImage.png'
                        : msg?.senderInfo?.image
                    }
                    alt={msg?.senderInfo?.username || 'User'}
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

    dispatch(setSocket(newSocket as CustomSocket));
  };
};

export default socketSlice.reducer;
