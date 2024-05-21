import { useEncrypt } from '@/compose/encrypt';

export function useBreakToken(key) {
    const saltKey = import.meta.env.VITE_SALT_KEY;
    var encodedText = localStorage.getItem('dfauth');
    
    if (encodedText) {
        var { decodedString } = useEncrypt(encodedText, saltKey);
        
        // var menus = decodedString.menus;
        // var token = decodedString.token;
        // var exp = decodedString.exp;
        // var permissions = decodedString.permissions;
        // var role = decodedString.role;
        console.log('decode', decodedString);
        return decodedString[key];
    }
}