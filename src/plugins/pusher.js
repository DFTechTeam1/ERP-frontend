import Pusher from 'pusher-js'

var pusher = new Pusher(import.meta.env.VITE_PUSHER_KEY, {
    cluster: 'ap1'
})

export default pusher;