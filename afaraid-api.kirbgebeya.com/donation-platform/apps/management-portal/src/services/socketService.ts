import { API_CONFIG } from '@/config';
import { io, Socket } from 'socket.io-client';

class SocketService {
    private socket: Socket | null = null;
    private listeners: Map<string, Function[]> = new Map();
    private connectionPromise: Promise<void> | null = null;
    private isConnecting: boolean = false;

    async connect(): Promise<void> {
        if (this.socket?.connected) return;

        if (this.isConnecting && this.connectionPromise) {
            return this.connectionPromise;
        }

        this.isConnecting = true;
        this.connectionPromise = new Promise((resolve, reject) => {
            if (this.socket) {
                this.socket.disconnect();
            }

            this.socket = io(API_CONFIG.SOCKET_URL, {
                transports: ['websocket', 'polling'],
                withCredentials: true,
                timeout: 10000, // 10 second timeout
            });

            const connectTimeout = setTimeout(() => {
                reject(new Error('Connection timeout'));
                this.isConnecting = false;
            }, 10000);

            this.socket.on('connect', () => {
                console.log('✅ Connected to server');
                clearTimeout(connectTimeout);
                this.isConnecting = false;
                this.emit('dashboard_join');
                resolve();
            });

            this.socket.on('connect_error', (error) => {
                console.error('❌ Connection error:', error);
                clearTimeout(connectTimeout);
                this.isConnecting = false;
                reject(error);
            });

            this.socket.on('disconnect', (reason) => {
                console.log('🔌 Disconnected from server:', reason);
                this.isConnecting = false;
            });

            this.socket.on('error', (error) => {
                console.error('Socket error:', error);
            });

            this.setupListeners();
        });

        return this.connectionPromise;
    }

    private setupListeners() {
        if (!this.socket) return;

        this.socket.on('stats_update', (data) => {
            console.log('📊 Received stats update', data);
            this.notifyListeners('stats_update', data);
        });

        this.socket.on('campaigns_update', (data) => {
            this.notifyListeners('campaigns_update', data);
        });

        this.socket.on('donations_update', (data) => {
            this.notifyListeners('donations_update', data);
        });

        this.socket.on('donors_update', (data) => {
            this.notifyListeners('donors_update', data);
        });

        this.socket.on('payments_update', (data) => {
            this.notifyListeners('payments_update', data);
        });

        this.socket.on('goats_update', (data) => {
            this.notifyListeners('goats_update', data);
        });

        this.socket.on('connection_established', (data) => {
            this.notifyListeners('connection_established', data);
        });

        this.socket.on('pong', (data) => {
            this.notifyListeners('pong', data);
        });
    }

    on(event: string, callback: Function) {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, []);
        }
        this.listeners.get(event)!.push(callback);
    }

    off(event: string, callback: Function) {
        const eventListeners = this.listeners.get(event);
        if (eventListeners) {
            const index = eventListeners.indexOf(callback);
            if (index > -1) {
                eventListeners.splice(index, 1);
            }
        }
    }

    private notifyListeners(event: string, data: any) {
        const eventListeners = this.listeners.get(event);
        if (eventListeners) {
            setTimeout(() => {
                eventListeners.forEach(callback => {
                    try {
                        callback(data);
                    } catch (error) {
                        console.error(`Error in listener for ${event}:`, error);
                    }
                });
            }, 0);
        }
    }

    emit(event: string, data?: any) {
        if (this.socket?.connected) {
            this.socket.emit(event, data);
        } else {
            console.warn('⚠️ Cannot emit - socket not connected');
        }
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
            this.listeners.clear();
            this.isConnecting = false;
            this.connectionPromise = null;
            console.log('🔌 Socket service disconnected');
        }
    }

    isConnected(): boolean {
        const connected = this.socket?.connected || false;
        console.log('🔍 Socket connection status:', {
            connected,
            connecting: this.isConnecting,
            socketExists: !!this.socket
        });
        return connected;
    }

    async waitForConnection(): Promise<boolean> {
        if (this.isConnected()) {
            return true;
        }

        if (this.isConnecting && this.connectionPromise) {
            await this.connectionPromise;
            return this.isConnected();
        }

        await this.connect();
        return this.isConnected();
    }

    async ping(): Promise<boolean> {
        if (!this.isConnected()) {
            return false;
        }

        return new Promise((resolve) => {
            const timeout = setTimeout(() => {
                resolve(false);
            }, 5000);

            this.socket?.emit('ping');

            const pongHandler = () => {
                clearTimeout(timeout);
                this.off('pong', pongHandler);
                resolve(true);
            };

            this.on('pong', pongHandler);
        });
    }
}

export const socketService = new SocketService();