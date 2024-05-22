import { useNotification } from "@kyvg/vue3-notification";

const { notify } = useNotification();

export function showNotification(message, type = 'success') {
    notify({
        title: type == 'success' ? 'Success' : 'Failed',
        text: message,
        type: type,
    });
}