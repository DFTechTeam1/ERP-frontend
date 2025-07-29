export function useAuth() {

    function isLoggedin() {
        if (localStorage.getItem('dfauthmain')) return true;

        return false;
    }

    function setupToken(token) {
        localStorage.setItem('dfauthmain', token);
    }

    return { isLoggedin, setupToken };
}
