// usePusher.js
import Pusher from 'pusher-js';

let pusherInstance = null;
let channel = null;

export function usePusher() {
    const setupPusher = (userId) => {
        if (!pusherInstance) {
            pusherInstance = new Pusher(import.meta.env.VITE_PUSHER_KEY, { cluster: 'ap1' });
        }
        
        const channelName = `my-channel-${userId}`;
        
        if (channel) {
            pusherInstance.unsubscribe(channelName);
        }
        
        channel = pusherInstance.subscribe(channelName);
        return channel;
    };

    const cleanup = () => {
        if (channel) {
            pusherInstance.unsubscribe(channel.name);
            channel = null;
        }
    };

    return { setupPusher, cleanup };
}