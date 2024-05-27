import { useEncrypt } from '@/compose/encrypt';

export function useBreakToken(key) {
    const saltKey = import.meta.env.VITE_SALT_KEY;
    var encodedText = localStorage.getItem('dfauth');
    
    if (encodedText) {
        var { decodedString } = useEncrypt(encodedText, saltKey);
        
        return decodedString[key];
    }
}