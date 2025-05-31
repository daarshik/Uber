const socketIo = require("socket.io");
const userModel = require("./models/user.model");
const captainModel = require("./models/captain.model");
const conversationModel = require("./models/conversation.model");
const rideModel = require("./models/ride.model");
const messageModel = require("./models/message.model");

let io;

function initializeSocket(server) {
  io = socketIo(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log(`Client connected: ${socket.id}`);

    socket.on("join", async (data) => {
      const { userId, userType } = data;

      if (userType === "user") {
        await userModel.findByIdAndUpdate(userId, { socketId: socket.id });
      } else if (userType === "captain") {
        await captainModel.findByIdAndUpdate(userId, { socketId: socket.id });
      }
    });

    // Join private chat room for a specific ride
    socket.on("join-private-chat", async ({ rideId }) => {
      if (!rideId) return;
      const room = `room_${rideId}`;
      socket.join(room);
      socket.emit("joined-private-chat", { room });
    });

    // Handle incoming private messages
    socket.on(
      "private-message",
      async ({ rideId, senderId, senderType, message }) => {
        if (!rideId || !senderId || !senderType || !message) return;

        // Retrieve or create the conversation associated with the ride
        let conversation = await conversationModel.findOne({ ride: rideId });
        if (!conversation) {
          const ride = await rideModel
            .findById(rideId)
            .populate("user captain");
          if (!ride) return;
          conversation = await conversationModel.create({
            ride: rideId,
            user: ride.user._id,
            captain: ride.captain._id,
          });
        }

        // Save the message to the database
        const savedMessage = await messageModel.create({
          conversation: conversation._id,
          sender: senderId,
          senderModel: senderType,
          text: message,
        });

        // Broadcast the message to all clients in the room
        const room = `room_${rideId}`;
        io.to(room).emit("private-message", {
          senderId,
          senderType,
          message,
          timestamp: savedMessage.createdAt,
        });
      }
    );

    socket.on("update-location-captain", async (data) => {
      const { userId, location: loc } = data;

      if (!loc || !loc.ltd || !loc.lng) {
        return socket.emit("error", { message: "Invalid location data" });
      }
      // console.log(`Updating location for captain ${userId}:`, loc);

      const resp = await captainModel.findByIdAndUpdate(
        userId,
        {
          $set: {
            "location.lat": loc.ltd,
            "location.lng": loc.lng,
          },
        },
        { new: true }
      );
      // console.log(resp);
    });

    socket.on("disconnect", () => {
      console.log(`Client disconnected: ${socket.id}`);
    });
  });
}

const sendMessageToSocketId = (socketId, messageObject) => {
  // console.log(messageObject);

  if (io) {
    io.to(socketId).emit(messageObject.event, messageObject.data);
  } else {
    console.log("Socket.io not initialized.");
  }
};

module.exports = { initializeSocket, sendMessageToSocketId };
