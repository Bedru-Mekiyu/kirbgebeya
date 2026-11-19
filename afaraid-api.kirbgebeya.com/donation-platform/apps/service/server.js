import dotenv from "dotenv";
import app from "./src/app.js";
import { createServer } from "http";
import SocketIOConfig from "./src/config/socketio.js";
import { setSocketHandlers } from "./src/modules/donations/donation.service.js";
import SocketHandlers from "./src/modules/socketHandlers.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

const server = createServer(app);

const ioConfig = new SocketIOConfig(server);
const socketHandlers = new SocketHandlers(ioConfig);
app.set("io", ioConfig);
app.set("socketHandlers", socketHandlers);
setSocketHandlers(socketHandlers);
app.initializeSocketHandlers = () => {
  return socketHandlers;
};


server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`🔌 Socket.IO enabled on port ${PORT}`);
});
