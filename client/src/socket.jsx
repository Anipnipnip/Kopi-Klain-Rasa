import { io } from "socket.io-client";

const socket = io("https://api.klainrasa.com", {
  withCredentials: true,
});

export default socket;