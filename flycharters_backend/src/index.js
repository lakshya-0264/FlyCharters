import mongoose from "mongoose";
import dotenv from "dotenv";
import { DBConnection } from "./Databases/dbconnection.js";
import { app } from "./app.js";
import http from "http";
import { Server } from "socket.io";
import { Message } from "./Models/ChatModel.js";
dotenv.config({
    path: "../.env"
});

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173", 
        methods: ["GET", "POST"],
        credentials: true
    }
});
app.set("io", io);
io.on("connection", (socket) => {
    console.log("New client connected:", socket.id);
    socket.on("join", (userId) => {
        if (!userId) {
        console.error("No userId provided in join event");
        return;
        }
        const roomName = `user-${userId}`;
        socket.join(roomName);
        console.log(`User ${userId} joined room ${roomName}`);
    });
    socket.on("chat-message", async (data) => {
        console.log("Message received from socket:", data);
        const { fromUserId, toUserId, message } = data;

        if (!fromUserId || !toUserId || !message?.trim()) return;

        try {
            const newMessage = await Message.create({
                sender: new mongoose.Types.ObjectId(fromUserId),
                recipient: new mongoose.Types.ObjectId(toUserId),
                message
            });

            const responseMessage = {
                _id: newMessage._id,
                fromUserId,
                toUserId,
                message,
                timestamp: newMessage.createdAt
            };
            console.log("Emitting message:", responseMessage);

            io.to(`user-${toUserId}`).emit("chat-message", responseMessage);
            io.to(`user-${fromUserId}`).emit("chat-message", responseMessage); 
        } catch (err) {
            console.error("Error saving message:", err);
        }
    });
    socket.on("disconnect", () => {
        console.log("Client disconnected:", socket.id);
    });
});

async function startServer() {
    try {
        server.listen(process.env.PORT, () => {
        console.log(`Server is running on port ${process.env.PORT}`);
        });
    } catch (err) {
        console.error("Error starting the server:", err);
    }
}

DBConnection()
    .then(() => {
        startServer();
    })
    .catch((e) => {
        console.error("Database connection failed:", e);
        process.exit(1);
    });
