// 登录密码加密
import CryptoJS from 'crypto-js'
const today = new Date()
const year = today.getFullYear()
let month = today.getMonth() + 1
let day = today.getDate()
if (day < 10) {
  day = `0${day}`
}
if (month < 10) {
  month = `0${month}`
}
const timeData = `${year}${month}${day}`
function reverse(str) {
  var arr = []
  var brr = str.split('')
  for (var i = 0, len = brr.length; i <= len - 1; i++) {
    arr[i] = brr[brr.length - i - 1]
  }
  return arr.join('')
}
const rtimeData = reverse(timeData)
const key = CryptoJS.enc.Latin1.parse(`${rtimeData}zju.edu.`)
export default function encypt(data) {
  const srcs = CryptoJS.enc.Utf8.parse(data)
  const encrypted = CryptoJS.AES.encrypt(srcs, key, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.ZeroPadding,
  })
  return encrypted.toString()
}
