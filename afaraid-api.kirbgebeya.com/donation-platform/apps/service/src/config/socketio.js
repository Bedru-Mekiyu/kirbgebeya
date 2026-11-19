const socketIO = require('socket.io');

class SocketIOConfig {
    constructor(server) {
        this.io = socketIO(server, {
            cors: {
                origin: [
                    "http://localhost:5173",
                    "http://localhost:5174",
                    "https://afaraid-admin.kirbgebeya.com",
                    "https://afaraid.kirbgebeya.com",
                ],
                methods: ["GET", "POST"],
                credentials: true
            },
            transports: ['websocket', 'polling']
        });

        this.connectedClients = new Map();
        this.setupEventHandlers();
    }

    setupEventHandlers() {
        this.io.on('connection', (socket) => {
            console.log('🔌 Client connected:', socket.id);
            this.connectedClients.set(socket.id, {
                connectedAt: new Date(),
                rooms: new Set()
            });

            socket.on('dashboard_join', () => {
                socket.join('dashboard');
                this.connectedClients.get(socket.id)?.rooms.add('dashboard');
                console.log(`📊 Client ${socket.id} joined dashboard room`);

                socket.emit('connection_established', {
                    message: 'Connected to real-time dashboard',
                    timestamp: new Date().toISOString()
                });
            });

            socket.on('disconnect', (reason) => {
                console.log('🔌 Client disconnected:', socket.id, 'Reason:', reason);
                this.connectedClients.delete(socket.id);
            });

            socket.on('error', (error) => {
                console.error('Socket error for client', socket.id, ':', error);
            });

            socket.on('ping', () => {
                socket.emit('pong', { timestamp: new Date().toISOString() });
            });
        });
    }

    broadcastToDashboard(event, data) {
        this.io.to('dashboard').emit(event, {
            ...data,
            timestamp: new Date().toISOString()
        });
    }

    broadcastToRoom(room, event, data) {
        this.io.to(room).emit(event, {
            ...data,
            timestamp: new Date().toISOString()
        });
    }

    getConnectionStats() {
        return {
            totalConnections: this.connectedClients.size,
            dashboardConnections: Array.from(this.connectedClients.values())
                .filter(client => client.rooms.has('dashboard')).length,
            connectedClients: Array.from(this.connectedClients.keys())
        };
    }
}

module.exports = SocketIOConfig;