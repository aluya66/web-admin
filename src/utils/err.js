/**
 * 统一异常处理
 *
 * @param {*} context vue上下文
 * @param {*} err 错误信息对象
 * @param {*} callback 异常处理回调函数
 * @returns null
 *
 */
import utils from 'utils'

export default (err, callBackFun, duration) => {
  const errCode = err.code
  let errMsg = ''
  console.log('err', err)
  switch (errCode) {
    case 9:
      errMsg = 'token失效'
      const token = utils.getUrlParam('token')
      if (!token) {
        errMsg = 'token不能为空'
      }
      utils.goToLogin('401')
      break
    case 102:
      errMsg = ''
      break
    default:
      errMsg = err.message
      break
  }
  console.log(`${errCode}【${errMsg}】`)
  window.globalVue.$msgTip(`${errCode}【${errMsg}】`, 'warning', duration)
  callBackFun && callBackFun(err)
}
