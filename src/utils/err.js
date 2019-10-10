/**
 * 统一异常处理
 *
 * @param {*} context vue上下文
 * @param {*} err 错误信息对象
 * @param {*} callback 异常处理回调函数
 * @returns null
 *
 */
export default (err, callBackFun, time) => {
  const errCode = err.code
  let errMsg = ''
  console.log('err', err)
  switch (errCode) {
    case 101:
      errMsg = ''
      break
    case 102:
      errMsg = ''
      break
    default:
      errMsg = err.message
      break
  }
  console.log(`${errCode}【${errMsg}】`)
  window.globalVue.$msgTip(`${errCode}【${errMsg}】`, time)
  callBackFun && callBackFun(err)
}
