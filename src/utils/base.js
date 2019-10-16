/**
 * 是否开发标识
 */
export const isDebug = process.env.NODE_ENV === 'development'

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
 *  统一跳转到登陆页面
 */
export const goToLogin = (page = 'login', type = 'push', time = 1.5) => {
  setTimeout(() => {
    this.$router[type]({
      path: `/${page}?redirect=${this.$route.fullPath}`
    })
  }, time * 1000)
}

/**
 * 二次确认提醒消息提示
 *
 * @param {string} [msg=''] 消息
 * @param {function} confirmBack 确认执行函数
 * @param {function} cancelBack 取消执行函数
 */
export const confirmTip = (msg, confirmBack, cancelBack) => {
  window.globalVue.$confirm(msg, '温馨提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    closeOnClickModal: false,
    type: 'warning',
    center: true
  }).then(() => {
    confirmBack && confirmBack()
  }).catch(() => {
    cancelBack && cancelBack()
    console.log('取消')
  })
}

/**
 * 格式化tree 数据
 * @param {*} res
 */
export const formartTreeData = (res, options) => {
  const loopList = (res, options) => {
    const list = []
    res.forEach(val => {
      let children = []
      let curList = {}
      if (val.child) {
        if (val.child.length) {
          if (options && options.hasAll) {
            const name =
              val.level + 1 === 2 ? '所有街道' : val.level + 1 === 3 ? '所有社区' : '所有区域'
            val.child.unshift({
              id: options.noId ? -val.id : val.id,
              level: val.level + 1,
              regionName: name,
              subId: val.subId,
              path: name,
              child: []
            })
          }
          if (options && options.noSelect) {
            const name =
              val.level + 1 === 2 ? '不选择街道' : val.level + 1 === 3 ? '不选择社区' : '不选择区域'
            val.child.unshift({
              id: val.id,
              level: val.level,
              regionName: name,
              path: val.regionName,
              subId: val.subId,
              disabled: options.disabledId && options.disabledId.includes(val.id),
              child: []
            })
          }
          children = loopList(val.child, options)
        }
        curList = {
          id: val.id,
          value: val.id,
          level: val.level,
          label: val.regionName,
          subId: val.subId,
          path: val.path,
          disabled: options &&
            options.disabledId &&
            options.disabledId.includes(val.id),
          children
        }
      }
      if (val.children) {
        if (val.children.length) {
          children = loopList(val.children, options)
        }
        curList = {
          id: val.id,
          parent: val.parent,
          label: val.resName,
          router: val.router,
          mIcon: val.mIcon,
          status: val.status,
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
export const debounce = (fn, delay) => {
  // eslint-disable-next-line no-undef
  let args = arguments
  let context = this
  let timer = null

  return function () {
    if (timer) {
      clearTimeout(timer)

      timer = setTimeout(function () {
        fn.apply(context, args)
      }, delay)
    } else {
      timer = setTimeout(function () {
        fn.apply(context, args)
      }, delay)
    }
  }
}
/**
 *  节流
 * @param {*} fn
 * @param {*} delay
 */
export const throttle = (fn, delay) => {
  // eslint-disable-next-line no-undef
  let args = arguments
  let context = this
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

      fn.apply(context, args)
      previous = now
    } else {
      if (!timer) {
        timer = setTimeout(function () {
          fn.apply(context, args)
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
      paramsStr += `${key}=${params[key]}${split}`
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

export default {
  isDebug,
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
  formartTreeData,
  isExternal,
  getUrlParam,
  openNewWin,
  goToLogin
}
