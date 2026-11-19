const jwt = require('jsonwebtoken');

function socketAuthMiddleware(socket, next) {
    // For now, we'll allow all connections
    // In production, you might want to add authentication
    try {
        // Example token verification (if using JWT)
        const token = socket.handshake.auth.token;

        if (token) {
            jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
                if (err) {
                    console.log('Socket auth failed:', err.message);
                    // Still allow connection but mark as unauthenticated
                    socket.isAuthenticated = false;
                } else {
                    socket.userId = decoded.userId;
                    socket.isAuthenticated = true;
                }
                next();
            });
        } else {
            // No token, allow connection but mark as unauthenticated
            socket.isAuthenticated = false;
            next();
        }
    } catch (error) {
        console.log('Socket auth error:', error);
        socket.isAuthenticated = false;
        next();
    }
}

module.exports = socketAuthMiddleware;