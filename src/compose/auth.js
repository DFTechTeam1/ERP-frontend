export function useAuth() {

    function isLoggedin() {
        if (localStorage.getItem('dfauth')) return true;

        return false;
    }

    function setupToken(token) {
        console.log('token', token);
        localStorage.setItem('dfauth', token);
    }

    return { isLoggedin, setupToken };
}