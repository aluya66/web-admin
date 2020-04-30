/* eslint-disable no-param-reassign */
/* eslint-disable no-useless-escape */
/* eslint-disable no-control-regex */

/**
 * 邮箱验证
 * @param {*} value
 */
export const isEmail = (value) => {
  const reg =
    /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i
  return reg.test(value)
}

/**
 * 验证手机号（1.0）
 * @param {*} value
 */
export const isMobile = (value) => {
  value = value.replace(/[^-|\d]/g, '')
  return /^((\+86)|(86))?(1)\d{10}$/.test(value) || /^0[0-9-]{10,13}$/.test(value)
}

/**
 * 验证数字
 * @param {*} value
 */
export const isNumber = value => /^\d+$/.test(value)

/**
 * 验证图片
 * @param {*} url
 */
export const isImage = url => /^(https?:)?\/\/|data:image/.test(url)

/**
 * 判断数据是否有效
 * @param {*} value
 */
export const isVal = value => value !== undefined && value !== null

/**
 * 判断是否为对象
 * @param {*} x
 */
export const isObj = (x) => {
  const type = typeof x
  return x !== null && (type === 'object' || type === 'function')
}

/**
 * 判断是否为字符串
 * @param {*} str
 */
export const isString = str => {
  if (typeof str === 'string' || str instanceof String) {
    return true
  }
  return false
}

/**
 * 判断是否为数字
 * @param {*} arg
 */
export const isArray = arg => {
  if (typeof Array.isArray === 'undefined') {
    return Object.prototype.toString.call(arg) === '[object Array]'
  }
  return Array.isArray(arg)
}

/**
 * @desc 基于ElementUI Form rules 进行使用, 参考官方文档: http://element-cn.eleme.io/#/zh-CN/component/form [自定义校验规则]
 * @example  rules: {
 *  ip: [
 *    {required: true, message: '请输入矩阵IP', trigger: 'blur'},
 *    {validator: this.$rules.ipAddress, trigger: 'blur'}
 *  ]
 * }
 *
 */
export const validater = {
  validUsername (str) {
    const validMap = ['admin', 'editor']
    return validMap.indexOf(str.trim()) >= 0
  },

  /* 合法uri */
  validateURL (textval) {
    const urlregex =
      /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
    return urlregex.test(textval)
  },

  /* 小写字母 */
  validateLowerCase (str) {
    const reg = /^[a-z]+$/
    return reg.test(str)
  },

  /* 大写字母 num位数限制 【例： '{2,20}'】 */
  validateUpperCase (str, num) {
    const reg = new RegExp('^[A-Z]' + (num || '+') + '$')
    // const reg = /^[A-Z]+$/
    return reg.test(str)
  },

  /* 大小写字母 num位数限制 【例： '{2,20}'】 */
  validateAlphabets (str, num) {
    // const reg = /^[A-Za-z]+$/
    const reg = new RegExp('^[A-Za-z]' + (num || '+') + '$')
    return reg.test(str)
  },
  /**
   * 校验 包括中文字、英文字母、数字和下划线
   * 登录账号校验
   */
  validateAccount (rule, value, callback) {
    const acount = /^(?!_)(?!.*?_$)[a-zA-Z0-9_\u4e00-\u9fa5]+$/
    if (value && !acount.test(value)) {
      callback(new Error('账号不符合规范'))
    } else {
      callback()
    }
  },
  /**
   * 校验2-20位账号 包括英文字母、数字和下划线
   * 登录账号校验
   */
  validateUserName (rule, value, callback) {
    if (/^[A-Za-z0-9_]{2,20}$/.test(value)) {
      callback()
    } else {
      // eslint-disable-next-line standard/no-callback-literal
      callback('请输入2至20位由字符、数字或下划线的账号')
    }
  },
  /**
   * 验证密码, 6-10位由字母、数字、下划线组合密码
   * @param {*} rule
   * @param {*} value
   * @param {*} callback
   */
  validatePass (rule, value, callback) {
    if (/^[A-Za-z0-9_]{6,10}$/.test(value)) {
      callback()
    } else {
      callback(new Error('请输入6至10位由字符、数字或下划线的密码'))
    }
  },
  /**
   * 验证邮箱
   * @param {*} rule
   * @param {*} value
   * @param {*} callback
   */
  validateEmail (rule, value, callback) {
    // if (value === '') {
    //   callback(new Error('请输入邮箱地址'))
    // } else
    if (value && !/^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(value)) {
      callback(new Error('请输入有效的邮箱'))
    } else {
      callback()
    }
  },
  /**
   * IP地址校验
   */
  ipAddress (rule, value, callback) {
    if (value && value === '...') {
      callback(new Error('请输入IP地址'))
    }
    if (
      value &&
      !/((25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))\.){3}(25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))/
        .test(
          value
        )
    ) {
      callback(new Error('IP地址不符合规范'))
    } else {
      callback()
    }
  },

  /**
   * 手机号码校验
   */
  phoneNumber (rule, value, callback) {
    if (!value) {
      callback(new Error('手机号码不能为空'))
    } else if (value && (!/^[1][3456789]\d{9}$/.test(value) || !/^[1-9]\d*$/.test(value) || value.length !== 11)) {
      callback(new Error('手机号码不符合规范'))
    } else {
      callback()
    }
  },
  /**
   * 手机号码校验(只校验符不符合要求,上面方法增加了空校验，由于之前已经在应用文件中，故新增一个方法只校验手机规则)
   */
  phoneRule (rule, value, callback) {
    if (value && (!/^[1][3456789]\d{9}$/.test(value) || !/^[1-9]\d*$/.test(value) || value.length !== 11)) {
      callback(new Error('手机号码不符合规范'))
    } else {
      callback()
    }
  },

  /**
   * 电话号码校验
   */
  telephoneNumber (rule, value, callback) {
    if (value && !/^((0\d{2,3}-\d{7,8})|(1[3584]\d{9}))$/.test(value)) {
      callback(new Error('电话号码不符合规范'))
    } else {
      callback()
    }
  },

  /**
   * 身份证号码校验
   */
  idCard (rule, value, callback) {
    if (
      value &&
      (!/\d{17}[\d|x]|\d{15}/.test(value) ||
        (value.length !== 15 && value.length !== 18))
    ) {
      callback(new Error('身份证号码不符合规范'))
    } else {
      callback()
    }
  },

  /**
   * 校验4-6位数字
   */
  integerArea (rule, value, callback) {
    if (value && !/^[1-9]\d*$/.test(value)) {
      callback(new Error('请输入正确的数字版本号'))
    } else {
      callback()
    }
  },

  /**
   * 正整数校验
   */
  integerP (rule, value, callback) {
    if (value && !/^[1-9]\d*$/.test(value)) {
      callback(new Error('只能填写正整数'))
    } else {
      callback()
    }
  },

  /**
   * 负整数校验
   */
  integerN (rule, value, callback) {
    if (value && !/^-[1-9]\d*$/.test(value)) {
      callback(new Error('只能填写负整数'))
    } else {
      callback()
    }
  },
  /**
   * 角色编码校验
   */
  roleCode (rule, value, callback) {
    if (!value) {
      callback(new Error('请输入角色编码'))
    } else {
      if (value && !/^[A-Z]+$/.test(value)) {
        callback(new Error('请输入正确角色编码'))
      } else {
        callback()
      }
    }
  },
  /**
   * 英文字符校验
   */
  enText (rule, value, callback) {
    if (!value) {
      callback(new Error('不能为空'))
    } else {
      let a = ''
      let arr = value.split(' ')
      for (let i = 0; i < arr.length; i++) {
        // 删除行内空格
        a += arr[i]
      }
      if (a && !/^[A-Za-z]+$/.test(a)) {
        callback(new Error('请输入正确内容'))
      } else {
        callback()
      }
    }
  },
  /**
   * 中文字符校验
   */
  cnText (rule, value, callback) {
    // let a = '',
    //   arr = value.split(" ")
    // for (let i = 0; i < arr.length; i++) { //删除行内空格
    //   a += arr[i];
    // }
    if (value && /[^\u4e00-\u9fa5]/.test(value)) {
      callback(new Error('只能填写中文字符'))
    } else {
      callback()
    }
  },
  /**
   * 非中文
   */
  notCnText (rule, value, callback) {
    if (value && /[\u4e00-\u9fa5]/.test(value)) {
      callback(new Error('不能填写中文字符'))
    } else {
      callback()
    }
  },
  /**
   * 只能输入英文或者数字
   */
  enOrNumText (rule, value, callback) {
    if (!value) {
      callback(new Error('字段不能为空'))
    } else if (!/^[A-Za-z0-9]+$/.test(value)) {
      callback(new Error('只能填写英文或者数字'))
    } else {
      callback()
    }
  },
  /**
   * 20位数字国标编码校验，且为正整数
   */
  validateDeviceNo (rule, value, callback) {
    if (value && !/^[1-9]\d*$/.test(value)) {
      callback(new Error('只能填写正整数'))
    } else {
      if (!/^[0-9]{20}$/.test(value)) {
        callback(new Error('请输入20位数字的编码！'))
      } else {
        callback()
      }
    }
  },
  /**
   *校验电脑Mac地址
   *以xx-xx-xx-xx-xx-xx的形式输入（xx为16进制数字）
   */
  validateMac (rule, value, callback) {
    const temp =
      /[A-Fa-f0-9]{2}-[A-Fa-f0-9]{2}-[A-Fa-f0-9]{2}-[A-Fa-f0-9]{2}-[A-Fa-f0-9]{2}-[A-Fa-f0-9]{2}/
    if (!temp.test(value)) {
      callback(new Error('请输入xx-xx-xx-xx-xx-xx形式的MAC地址！'))
    } else {
      callback()
    }
  },
  /**
   * 校验地址代码或者分组代码
   */
  validateCode (rule, value, callback) {
    const num = /^[1-9]\d*$/
    if (value && !num.test(value)) {
      callback(new Error('只能填写正整数'))
    } else {
      const codeLen = value.toString().length
      if (codeLen > 0 && codeLen % 3 !== 0) {
        callback(new Error('输入的长度必须是3的倍数'))
      } else if (codeLen > 18) {
        callback(new Error('输入的长度不能超过18位,请重新输入'))
      } else {
        callback()
      }
    }
  },

  /**
   * 校验字符长度
   */
  validateLength (rule, value, callback) {
    const codeLen = value.toString().length
    if (codeLen > 18) {
      callback(new Error('输入的长度不能超过20位,请重新输入'))
    }
  },

  /**
   * 数字 ,两位
   */
  validateTwoNum (rule, value, callback) {
    const temp = /^[1-9]{2}$/
    if (!temp.test(value)) {
      callback(new Error('请输入两位正整数！'))
    } else {
      callback()
    }
  },

  /**
   * 数字【不能为空、大于0 支持小数】
   */
  checkNumber (rule, value, callback) {
    if (!value || !Number(value) || Number(value) < 0) {
      callback(new Error('请输入大于0的数字'))
    } else {
      callback()
    }
  },

  /**
   * 金额【大于0 支持2位小数】
   */
  checkMoney (rule, value, callback) {
    const temp = /^(\d+)(.\d{0,2})?$/
    if (!temp.test(value)) {
      callback(new Error('请输入大于0的数字'))
    } else {
      callback()
    }
  }
}

export default {
  isEmail,
  isMobile,
  isNumber,
  isArray,
  isString,
  isObj,
  isVal,
  isImage,
  validater
}
