import { useEncrypt } from '@/compose/encrypt';

export function useBreakToken(key, localStorageKey = 'dfauth') {
    const saltKey = import.meta.env.VITE_SALT_KEY;
    console.log('saltKey', saltKey);
    console.log('localStorageKey', localStorageKey);
    var encodedText = localStorage.getItem(localStorageKey);
    if (encodedText) {
        var { decodedString } = useEncrypt(encodedText, saltKey);

        return decodedString[key];
    }
}
