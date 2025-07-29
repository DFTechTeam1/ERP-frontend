import { useBreakToken } from './breakToken';

export function useCheckPermission(permission) {
    var permissions = useBreakToken('permissions', 'pEnc');

    var check = permissions.indexOf(permission);

    return check == -1 ? false : true;
}