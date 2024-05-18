import { useEncrypt } from '@/compose/encrypt';

export function useGetRole() {
    const saltKey = import.meta.env.VITE_SALT_KEY;
    var encodedText = localStorage.getItem('dfauth');
    
    if (encodedText) {
        var { decodedString } = useEncrypt(encodedText, saltKey);
        
        var role = decodedString.role;

        return role;
    }
}