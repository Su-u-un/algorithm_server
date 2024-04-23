/**弃用，生成的svg无法使用 */

const captcha = require("svg-captcha");

function createCaptcha() {
    return captcha.create({
        // size: 4,
        // ignoreChars: "0oO1ilI",
        // noise: 2,
        // color: true,
        size: 4, // 验证码长度
        ignoreChars: "0o1iLl", // 验证码字符中排除 0o1i
        color: true, // 验证码是否有彩色
        noise: 0, //干扰线
        background: "#666", // 背景颜色
        height: 50,
        fontSize: 60,
        width: 100,
    });
}

module.exports = createCaptcha