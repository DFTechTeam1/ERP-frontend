import CryptoJS from "crypto-js";

export function useEncrypt(encryptedString, key) {
    var decodedString = '';

    function encryptMethod() {
        return "AES-256-CBC"
    }

    function encryptMethodLength() {
        var encryptMethodText = encryptMethod();
        // get only number from string.
        var aesNumber = encryptMethodText.match(/\d+/)[0];
        return parseInt(aesNumber);
    }

    function decrypt() {
        
        try {
            var json = JSON.parse(CryptoJS.enc.Utf8.stringify(CryptoJS.enc.Base64.parse(encryptedString)));
        
            var salt = CryptoJS.enc.Hex.parse(json.salt);
            var iv = CryptoJS.enc.Hex.parse(json.iv);
        
            var encrypted = json.ciphertext;// no need to base64 decode.
        
            var iterations = parseInt(json.iterations);
            if (iterations <= 0) {
                iterations = 999;
            }
            var encryptMethodLengthRes = (encryptMethodLength()/4);// example: AES number is 256 / 4 = 64
            var hashKey = CryptoJS.PBKDF2(key, salt, {'hasher': CryptoJS.algo.SHA512, 'keySize': (encryptMethodLengthRes/8), 'iterations': iterations});
        
            var decrypted = CryptoJS.AES.decrypt(encrypted, hashKey, {'mode': CryptoJS.mode.CBC, 'iv': iv});

            decodedString = decrypted.toString(CryptoJS.enc.Utf8);

            decodedString = JSON.parse(decodedString);
        } catch (error) {
            localStorage.removeItem('dfauth');
            localStorage.removeItem('dfreportauth');
            window.location.href = '/auth/a/login';
        }

    }

    decrypt()

    return { decodedString }
}