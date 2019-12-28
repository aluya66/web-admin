import Vue from 'vue'
import fileDownload from 'js-file-download'
/**
 * 是否开发标识
 */
export const isDebug = process.env.NODE_ENV === 'development'

/**
 * 判断是否为对象
 * @param {Object}} obj
 */
export const isObject = obj => Object.prototype.toString.call(obj) === '[object Object]'

/**
 * 判断是否为整数
 * @param {Object}} val
 */
export const isInteger = val => val && !/^[1-9]\d*$/.test(val)

/**
 * 判断是否为数组
 * @param {Array} arr
 */
export const isArray = arr => Array.isArray(arr)

/**
 * 将数字转换为千分位显示
 * // 先提取整数部分，对整数部分添加分隔符
 * @param {*} num
 */
export const setNumToThousand = num => num.toString().replace(/\d+/, n => n.replace(/(\d)(?=(\d{3})+$)/g, $1 => $1 + ','))

/**
 * 设置金额格式为数字
 * @param {*} val
 */
export const setThousandToNum = val => val && val.trim().replace(/,/g, '')

/**
 * 路由打开新窗口
 * 还可以通过<router-link target="_blank" 和 <a target="_blank"这两种方式开新窗口
 */
export const openNewWin = (routerOpts) => {
  const {
    $router
  } = this
  let routePath = ''
  if (routerOpts.url) {
    routePath = routerOpts.url
  } else {
    routePath = $router.resolve({
      name: routerOpts.name,
      query: routerOpts.query,
      params: routerOpts.params
    })
  }
  window.open(routePath, '_blank')
}

/**
 * 日期处理，回显到日期组件中
 * @param {*} startDate 起始日期
 * @param {*} endDate 结束日期
 * return [startDate, endDate] 返回一个数组， [起始时间，结束时间]
 */
export const handleDate = (startDate, endDate) => {
  return [Date(startDate), Date(endDate)]
}

/**
 * 二进制流文件转换成xlsx文件
 * @param {file} file
 */
export const createBlobFile = fileDownload
// export const createBlobFile = (file) => {
// let blob = new Blob([file], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=ISO8859-1' })
// let fileUrl = URL.createObjectURL(blob)
// window.location.href = fileUrl
// }

/**
 *  统一跳转到登陆页面
 */
export const goToLogin = (page = 'login', type = 'push') => {
  window.globalVue.$router[type]({
    path: `/${page}?redirect=${window.globalVue.$route.fullPath}`
  })
}

/**
 * 二次确认提醒消息提示
 *
 * @param {string} [msg=''] 消息
 * @param {function} confirmHandle 确认执行函数
 * @param {function} cancalHandle 取消执行函数
 * @param {Object} opt 属性设置
 */
export const confirmTip = function () {
  let params = {}
  const msg = arguments[0]
  if (typeof arguments[1] === 'function' || typeof arguments[1] === 'string') {
    if (typeof arguments[1] === 'function') {
      params = {
        confirmHandle: arguments[1]
      }
    } else {
      params = {
        title: arguments[1]
      }
    }
    if (isObject(arguments[2])) {
      params = {
        ...params,
        ...arguments[2]
      }
    }
  } else if (isObject(arguments[1])) {
    params = arguments[1]
  }
  const {
    title,
    confirmHandle,
    cancalHandle,
    ...other
  } = params

  window.globalVue.$confirm(msg, title || '温馨提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    distinguishCancelAndClose: true,
    closeOnClickModal: false,
    type: 'warning',
    center: true,
    ...other
  }).then(() => {
    params.confirmHandle && params.confirmHandle()
  }).catch(action => {
    if (action === 'cancel') {
      params.cancalHandle && params.cancalHandle()
    }
    console.log('取消')
  })
}

/**
 * 格式化tree和Cascader数据
 * @param {*} res
 */
export const formartLevelData = (res, options) => {
  const loopList = (res, options) => {
    const list = []
    res.forEach(val => {
      let children = []
      let curList = {}
      if (val.childrenList) {
        if (val.childrenList.length) {
          children = loopList(val.childrenList, options)
        }
        curList = {
          id: val.categoryCode,
          value: val.categoryCode,
          level: val.categoryLevel,
          label: val.categoryName,
          isShow: val.showFlag,
          pCode: val.parentCode,
          children
        }
      }
      if (!curList.children.length) {
        delete curList.children
      }
      list.push(curList)
    })
    return list
  }
  return loopList(res, options)
}

/**
 * 获取本地语言
 */
export const getCurrentUserLanguage = () => {
  const lang = 'zh-CN'
  return (
    lang ||
    (navigator.languages && navigator.languages[0]) ||
    navigator.language ||
    process.env.VUE_APP_defaultLanguage
  )
}

/**
 * 下载附件
 * @param {*} url '/xxx'
 * @param {*} param {key: value}
 */
export const donwFile = (url, param) => {
  window.open(
    `${window.globalVue.$filePath}${
    process.env.VUE_APP_serverPath
    }${url}?${serializeParam(param)}`
  )
}

/**
 * 改为驼峰命名
 * @param {*} str
 */
export const camelize = str => str.replace(/-(\w)/g, (_, c) => c.toUpperCase())

/**
 * 对象合并
 * @param {*} target
 * @param {*} source
 */
export const objectMerge = (target, source) => {
  /* Merges two  objects,
      giving the last one precedence */

  if (typeof target !== 'object') {
    target = {}
  }
  if (Array.isArray(source)) {
    return source.slice()
  }
  Object.keys(source).forEach(property => {
    const sourceProperty = source[property]
    if (typeof sourceProperty === 'object') {
      target[property] = objectMerge(target[property], sourceProperty)
    } else {
      target[property] = sourceProperty
    }
  })
  return target
}

/**
 * 防抖
 * @param {*} fn
 * @param {*} delay
 */
export const debounce = (fn, delay, that) => {
  // eslint-disable-next-line no-undef
  let timer = null
  clearTimeout(timer)
  return function () {
    timer = setTimeout(function () {
      fn.apply(that, arguments)
    }, delay)
  }
}
/**
 *  节流
 * @param {*} fn
 * @param {*} delay
 */
export const throttle = (fn, delay) => {
  // eslint-disable-next-line no-undef
  let timer = null
  let remaining = 0
  let previous = new Date()

  return function () {
    let now = new Date()
    remaining = now - previous

    if (remaining >= delay) {
      if (timer) {
        clearTimeout(timer)
      }

      fn.apply(this, arguments)
      previous = now
    } else {
      if (!timer) {
        timer = setTimeout(function () {
          fn.apply(this, arguments)
          previous = new Date()
        }, delay - remaining)
      }
    }
  }
}

/**
 *  将object参数，转换成以kv形式拼接，主要用于Content-Type === 'application/x-www-form-urlencoded'时
 *
 * @param {*} [params={}]
 * @example
 *  params:{
 *    id: 12313,
 *    name: xxx
 *  }
 * @returns id=12313&name=xxx
 * 当以'/'分割时，/12313/xxx
 */
export const serializeParam = (params = {}, split = '&') => {
  let paramsStr = '' // 数据拼接字符串
  Object.keys(params).forEach(key => {
    if (split === '&') {
      paramsStr += `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}${split}`
    } else if (split === '/') {
      paramsStr += `${params[key]}${split}`
    }
  })

  if (paramsStr !== '') {
    return paramsStr.substr(0, paramsStr.lastIndexOf(`${split}`))
  }
  return paramsStr
}

/**
 * 截取url指定参数值
 *
 * @param {*} name
 * @returns
 * @ example
 *  url：http://wwww.jb51.net/?q=js
 *
 *  getUrlParam(q) => js
 */
export const getUrlParam = name => {
  const reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`)
  const curStr = window.location.href.split('?')
  let r = ''
  if (curStr[1]) {
    r = curStr[1].match(reg) // search,查询？后面的参数，并匹配正则
    if (r !== null) return unescape(r[2])
  }
  return r
}

/**
 * 掩码字符串，中英文同时支持
 *
 * @param {*} str 字符串
 * @param {*} n   截取的长度
 *  碰到空格、逗号截止，后面的直接*，带上*最长7个字符
 */
export const splitStr = (str, n = 6) => {
  if (!str) return
  let splitArr = ''
  if (str.indexOf(',') !== -1) {
    splitArr = str.split(',')[0]
  } else if (str.indexOf('，') !== -1) {
    splitArr = str.split('，')[0]
  } else {
    splitArr = str.split(' ')[0]
  }
  // eslint-disable-next-line no-control-regex
  const reg = /[^\x00-\xff]/g
  if (str.replace(reg, '**').length > n) {
    splitArr = `${splitArr}*`
  }
  if (splitArr.replace(reg, '**').length <= n) {
    return splitArr
  }
  const m = Math.floor(n / 2)
  for (let i = m; i < splitArr.length; i++) {
    if (splitArr.substr(0, i).replace(reg, '**').length >= n) {
      return `${splitArr.substr(0, i)}*`
    }
  }
  return splitArr
}
/**
 * 数组去重
 * @param {*} arr
 */
export const uniqueArr = arr => Array.from(new Set(arr))

/**
 * 合并数组后取数组值交际
 */
export const removeRepeatByFilter = array =>
  array.filter((item, index) => array.indexOf(item) === index)

/**
 * 随机数
 */
export const createUniqueString = (num = 10) => {
  const timestamp = +new Date() + ''
  const randomNum = parseInt((1 + Math.random()) * 123)
  return (+(randomNum + timestamp)).toString(num)
}

/**
 * 获取随机16位数字
 */
export const getRandomNum = () => `${Math.random()}`.split('.')[1].substr(0, 16)

export const isExternal = path => {
  return /^(https?:|mailto:|tel:)/.test(path)
}
export const Event = new Vue()
export default {
  isDebug,
  isObject,
  isArray,
  isInteger,
  createBlobFile,
  confirmTip,
  getCurrentUserLanguage,
  donwFile,
  camelize,
  debounce,
  objectMerge,
  throttle,
  splitStr,
  serializeParam,
  uniqueArr,
  removeRepeatByFilter,
  createUniqueString,
  getRandomNum,
  formartLevelData,
  isExternal,
  getUrlParam,
  openNewWin,
  goToLogin,
  setNumToThousand,
  setThousandToNum,
  handleDate,
  Event
}
