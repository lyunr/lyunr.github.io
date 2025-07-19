// 加密密钥（建议至少32位随机字符）
const SECRET_KEY = '你的32位加密密钥@1234567890';

// 加密函数
function encryptUrl(url) {
    return CryptoJS.AES.encrypt(url, SECRET_KEY).toString();
}

// 解密函数
function decryptUrl(encrypted) {
    const bytes = CryptoJS.AES.decrypt(encrypted, SECRET_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
}
