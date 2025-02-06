// Socket.IO singleton instance
let io = null;

module.exports = {
  // Initialize Socket.IO instance
  init: (httpServer) => {
    const { Server } = require("socket.io");
    io = new Server(httpServer, {
      cors: {
        origin: "*", // In production, replace with specific origins
        methods: ["GET", "POST"],
      },
    });

    // Socket.IO connection handler
    io.on("connection", (socket) => {
      console.log(`[Socket.IO] Client connected with ID: ${socket.id}`);
      console.log(
        `[Socket.IO] Number of connected clients: ${io.engine.clientsCount}`
      );

      socket.on("disconnect", (reason) => {
        console.log(
          `[Socket.IO] Client ${socket.id} disconnected. Reason: ${reason}`
        );
        console.log(
          `[Socket.IO] Remaining connected clients: ${io.engine.clientsCount}`
        );
      });

      socket.on("error", (error) => {
        console.error(`[Socket.IO] Error from client ${socket.id}:`, error);
      });

      // Log when client joins a room
      socket.on("join", (room) => {
        socket.join(room);
        console.log(`[Socket.IO] Client ${socket.id} joined room: ${room}`);
      });

      // Log when client leaves a room
      socket.on("leave", (room) => {
        socket.leave(room);
        console.log(`[Socket.IO] Client ${socket.id} left room: ${room}`);
      });
    });

    // Log Socket.IO server initialization
    console.log("[Socket.IO] Server initialized and ready for connections");

    return io;
  },

  // Get Socket.IO instance
  getIO: () => {
    if (!io) {
      throw new Error("Socket.IO not initialized!");
    }
    return io;
  },
};
