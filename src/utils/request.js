import axios from 'axios'
import utils from 'utils'

import errFun from './err'

// 请求编码模式
const CONTENTTYPE = {
  common: 'application/json', // 以json数据传输
  upload: 'multipart/form-data', // 上传文件或二进制数据传输
  serializeData: 'application/x-www-form-urlencoded' // post模式，数据以&key=value拼接传输
}

let cancel = null
const promiseArr = {}
// const CancelToken = axios.CancelToken;
const instance = axios.create({
  baseURL: '', // !utils.isDebug ? process.env.VUE_APP_serverUrl : '',
  timeout: 10000
})

instance.interceptors.request.use((config) => {
  const arrFlag = `${config.url}?${JSON.stringify(config.data)}`
  // 重复请求取消操作
  if (promiseArr[arrFlag]) {
    promiseArr[arrFlag]('_CACHE_')
    promiseArr[arrFlag] = cancel
  } else {
    promiseArr[arrFlag] = cancel
  }
  // 当loading为false时，不需要全局loading效果
  if (config.customConfig && config.customConfig.loading) {
    // loadingInstace = null;
    // window.globalVue.$toast({
    //   mask: true,
    //   message: '加载中...'
    // });
    // loadingInstace = window.globalVue.$loading({
    //   fullscreen: true
    // });
  }
  return config
}, err => Promise.reject(err))

// 拦截返回的信息，做统一异常处理
instance.interceptors.response.use(response => {
  const { data, config, headers } = response
  if (response.status === 200) {
    if (data && config.responseType === 'arraybuffer') { // 下载
      const contentDisposition = headers['content-disposition']
      let filename = null
      if (contentDisposition) {
        filename = contentDisposition.split(';').find(res => res.indexOf('filename=') !== -1)
      }
      return {
        data,
        filename: filename ? decodeURIComponent(filename.split('=')[1]) : '下载文件.xlxs'
      }
    }
    if (data.code === 0) {
      // 正常返回数据，指返回data;
      return data
    }
  }

  // 异常返回数据，返回
  if (!promiseArr.isGlobalErr) {
    errFun && errFun(data)
  }
  return data
})

/**
 * 根据method设置header相关设置
 *
 * @param {*} mtd 当前传入的请求方式
 * @returns {Object} 返回请求方式和header的contentType设置
 */
const setHeaderMethod = mtd => {
  let method = 'post'
  let contentType = CONTENTTYPE.common
  switch (mtd) {
    case 'post':
    case 'get':
    case 'delete':
    case 'put':
      method = mtd
      break
  }
  return {
    method,
    contentType
  }
}

/**
 * 开发debug下，mock模拟数据
 * @param {*} mockFile 请求接口名称
 * @returns
 */
const setProxy = mockFile => `/mock/${mockFile}`

/**
 *  加工请求参数，默认post
 *
 * @param {*} url 接口地址
 * @param {*} [params={}] 接口参数
 * @param {*} [opt={
 *  method : 'get' //以get方式请求，默认为post
 *  cache : '缓存名' //接口数据需要缓存时配置，默认不缓存
 *  token : 是否传入token，默认取本地存储
 * }]
 * @returns axios params
 */

const setParams = (url, params = {}, opt = {}) => {
  promiseArr.isGlobalErr = !!opt.hasErrMsg

  // 请求个性化配置
  instance.defaults.customConfig = {
    loading: true,
    ...opt
  }
  // 开发阶段本地mock数据时，以get请求本地文件
  if (opt.mockFile && utils.isDebug && process.env.VUE_APP_MOCKFLAG === 'true') {
    opt.method = 'get'
    url = setProxy(opt.mockFile)
  }
  // 设置header和method
  let {
    method,
    contentType
  } = setHeaderMethod(opt.method)
  const token = utils.getStore('SET_USERINFO') ? utils.getStore('SET_USERINFO').token : ''
  if (CONTENTTYPE[opt.contentType]) {
    contentType = CONTENTTYPE[opt.contentType] // 特殊接口指定contentType
  }
  let curParams = {
    url,
    headers: {
      'Content-Type': contentType,
      'token': opt.token || token
    },
    method,
    responseType: opt.responseType || 'json' // 下载文件时传入 opt.responseType为 arraybuffer
  }
  // get请求和post请求参数和
  if (method.toLowerCase() === 'get') {
    const curUrl = opt.joinUrl ? `${url}/${utils.serializeParam(params, opt.joinUrl)}` : url
    curParams = {
      ...curParams,
      url: curUrl,
      params: opt.joinUrl ? {} : params,
      paramsSerializer(params) {
        return utils.serializeParam(params, opt.joinUrl)
      }
    }
  } else {
    curParams = {
      data: contentType === CONTENTTYPE.serializeData ? utils.serializeParam(params)
        : params,
      ...curParams
    }
  }
  return curParams
}

export default {
  /**
   * 同时支持get、post、put请求
   *
   * @param {*} url 接口地址
   * @param {*} [params={}] 接口参数
   * @param {*} [opt={
   *  type : true, //将params参数以key/value形式拼接,method为get时生效
   *  method : 'get' //以get方式请求，默认为post
   *  cache : '缓存名' //接口数据需要缓存时配置，默认不缓存
   * }]
   * @returns prmoise对象
   */
  fetch(url, params = {}, opt = {}) {
    const options = setParams(url, params, opt)
    return new Promise((resolve, reject) => {
      // 判断是否需要缓存
      if (opt.cache && utils.getStore(opt.cache)) {
        resolve(utils.getStore(opt.cache))
      } else {
        instance(options).then((res) => {
          if (res.code !== 0) {
            if (opt.hasErrMsg) {
              resolve(res)
            } else {
              reject(res.msg || res.retmsg)
            }
          } else {
            if (res.totalCount !== undefined) {
              if (res.totalCount) {
                res.data = {
                  data: res.data || [],
                  totalCount: res.totalCount
                }
              } else {
                res.data = []
              }
            }
            opt.cache && utils.setStore(opt.cache, res.data)
            resolve(opt.hasErrMsg ? res : res.data)
          }
        }).catch((error) => {
          reject(error)
        }).finally((a, b, c) => {
          if (utils.debug) {
            console.log('========== 当前请求 ============')
            console.log('请求地址：' + url)
            console.log('请求token：' + utils.getStore('token'))
            console.log('请求接口参数：' + JSON.stringify(params))
            console.log('请求配置项：' + JSON.stringify(opt))
            console.log('返回数据：' + JSON.stringify(a, b, c))
            console.log('========== 当前请求 =============')
          }
        })
      }
    })
  }
}
