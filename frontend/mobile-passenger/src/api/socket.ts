import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

const getBaseUrl = () => {
    let host = '192.168.223.21'; // Default
    if (Constants.expoConfig?.hostUri) {
        const uri = Constants.expoConfig.hostUri.split(':')[0];
        if (!uri.includes('exp.direct') && !uri.includes('ngrok') && !uri.includes('tunnel')) {
            host = uri;
        }
    }
    // Use ws:// for unencrypted, wss:// for encrypted (in prod)
    return `ws://${host}:8000/api/v1/ws`;
};

class SocketService {
    private socket: WebSocket | null = null;
    private listeners: { [event: string]: Function[] } = {};

    connect = async () => {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) return;

        const token = await AsyncStorage.getItem('access_token');
        if (!token) {
            console.log('Socket: No token found, cannot connect');
            return;
        }

        const url = `${getBaseUrl()}?token=${token}&role=passenger`;
        console.log('Socket: Connecting to', url);

        try {
            this.socket = new WebSocket(url);

            this.socket.onopen = () => {
                console.log('Socket: Connected');
                this.emit('connect', null);
            };

            this.socket.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    // Validar se mensagem tem estrutura {type: 'EVENT_NAME', ...data}
                    // O backend manda {type: "...", ...}
                    if (data.type) {
                        this.emit(data.type, data);
                    } else if (data.message) {
                        // Fallback for simple echo messages
                        console.log("Socket message:", data.message);
                    }
                } catch (e) {
                    console.log('Socket: Failed to parse message', event.data);
                }
            };

            this.socket.onclose = (event) => {
                console.log('Socket: Disconnected', event.reason);
                this.emit('disconnect', event.reason);
                this.socket = null;
                // Simple reconnect logic could be added here
            };

            this.socket.onerror = (error) => {
                console.log('Socket: Connection Error', error);
                this.emit('connect_error', error);
            };

        } catch (e) {
            console.log("Socket initialization error:", e);
        }
    }

    disconnect = () => {
        if (this.socket) {
            this.socket.close();
            this.socket = null;
        }
    }

    // Mimic socket.io 'on'
    on = (event: string, callback: Function) => {
        if (!this.listeners[event]) {
            this.listeners[event] = [];
        }
        this.listeners[event].push(callback);
    }

    // Mimic socket.io 'off'
    off = (event: string, callback?: Function) => {
        if (!this.listeners[event]) return;
        if (callback) {
            this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
        } else {
            delete this.listeners[event];
        }
    }

    private emit = (event: string, data: any) => {
        if (this.listeners[event]) {
            this.listeners[event].forEach(cb => cb(data));
        }
    }
}

export const socketService = new SocketService();
