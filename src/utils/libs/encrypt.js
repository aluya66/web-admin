import JsEncrypt from 'jsencrypt'
// import sha256 from 'crypto-js/sha256'
// import hmacSHA265 from 'crypto-js/hmac-sha256'
// import Base64 from 'crypto-js/enc-base64'
import md5 from 'crypto-js/md5'

// import utils from 'utils'

// const APPID = '100000000000000000'
// const APPKEY = 'dc5af4fb5bf04fd6' // sid_health_appkey_ver_1

// 登录密码加密公钥匙
const SECRET = {
  key: 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC/s2STzcnH2gY7LaOxqsGS5FWcWm7j94bZkaw6CC4X/nU0IwxuBTPhq7xyC3WiKUIZ92TcbaGBgUmYpv6g4oq9in7ZAn/jlXl6EJKA4MrOQTxr3Z2NJ3jkXbzbHe6x0Pt9WK6LwqUknULueWiU/oOAnUDadLo1vf/jkar2iKxiLwIDAQAB'
}

// const md5Params = {
//   appkey: APPKEY,
//   qualify_type: 1
// }

/**
 * 登录加密
 * @param {*} data 加密参数
 */
export const encrypt = data => {
  const encrypt = new JsEncrypt()
  encrypt.setPublicKey(SECRET.key)
  return encrypt.encrypt(data)
}

/**
 * sha256加密
 *
 * @param {*} data
 * @returns
 */
// export const cryptoSha = data => sha256(data)

/**
 * md5 加密
 * @param {*} data
 */
export const cryptoMd5 = data => md5(data)

/**
 * 对数据进行hmacSHA265 加密
 * @param {*} appkey 密钥
 * @param {*} data，加密字段（当前时间戳+随机数+所有参数)
 */
// export const cryptoHmacSHA265 = (data, appkey) => hmacSHA265(data, appkey)

/**
 *  生成token
 * @param {*} data
 */
// export const setToken = (data, appkey) => Base64.stringify(cryptoHmacSHA265(data, appkey))

/**
 * 构造请求头部的Authorization值
 * @param {*} appid
 * @param {*} appkey
 * @param {*} data
 */
// export const getAuth = data => `appid="${APPID}",token="${setToken(data, APPKEY)}"`

/**
 * 获取签名
 * @param {*} data
 * @example appkey=value&qualify_type=value&salt=value&smartid=value&key=secret value
 */
// export const getSign = data => md5(utils.serializeParam({
//   ...md5Params,
//   ...data,
//   ...SECRET
// }))

export default {
  encrypt
}
