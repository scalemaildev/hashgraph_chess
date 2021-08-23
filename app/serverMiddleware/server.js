console.log("Setting up socket.io server ...");

const io = require("socket.io")(3001, {
    cors: {
        origin: '*',
    }
});

// Since we are a serverMiddleware, we have to return a handler, even if this it does nothing
export default function (req, res, next) {
  next();
}
