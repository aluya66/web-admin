export function fomartDate (time, cFormat) {
  if (arguments.length === 0) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if (typeof time === 'string' && /^[0-9]+$/.test(time)) {
      time = parseInt(time)
    }
    if (typeof time === 'number' && time.toString().length === 10) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const timeStr = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') {
      return ['日', '一', '二', '三', '四', '五', '六'][value]
    }
    if (result.length > 0 && value < 10) {
      value = '0' + value
    }
    return value || 0
  })
  return timeStr
}
/**
 * element-ui 时间空间配置
 */
export const pickerOptions = {
  shortcuts: [
    {
      text: '今天',
      onClick (picker) {
        const end = new Date()
        const start = new Date(new Date().toDateString())
        end.setTime(start.getTime() + 3600 * 1000 * 24 - 1)
        picker.$emit('pick', [start, end])
      }
    },
    {
      text: '最近一周',
      onClick (picker) {
        const end = new Date(new Date().toDateString())
        const start = new Date()
        start.setTime(end.getTime() - 3600 * 1000 * 24 * 7)
        picker.$emit('pick', [start, end])
      }
    },
    {
      text: '最近一个月',
      onClick (picker) {
        const end = new Date(new Date().toDateString())
        const start = new Date()
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
        picker.$emit('pick', [start, end])
      }
    },
    {
      text: '最近三个月',
      onClick (picker) {
        const end = new Date(new Date().toDateString())
        const start = new Date()
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
        picker.$emit('pick', [start, end])
      }
    }
  ]
}

// element-ui 时间限制
export const disabledDate = {
  /**
   * 禁用当前时间以前的日期，不包括当天
   * @param {*} time
   */
  disPrevToday(time) {
    return time.getTime() < Date.now() - 8.64e7
  },
  /**
   * 禁用当前时间以后的日期，不包括当天
   * @param {*} time
   */
  disNextToday(time) {
    return time.getTime() > Date.now()
  },
  /**
   * 禁用当前时间以前的日期，包括当天
   * @param {*} time
   */
  disToday(time) {
    return time.getTime() < Date.now()
  }
}

export function formatTime (time, option) {
  if (('' + time).length === 10) {
    time = parseInt(time) * 1000
  } else {
    time = +time
  }
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return fomartDate(time, option)
  } else {
    return (
      d.getMonth() +
      1 +
      '月' +
      d.getDate() +
      '日' +
      d.getHours() +
      '时' +
      d.getMinutes() +
      '分'
    )
  }
}

export function getTime (type) {
  if (type === 'start') {
    return new Date().getTime() - 3600 * 1000 * 24 * 90
  } else {
    return new Date(new Date().toDateString())
  }
}

/**
 * 获取当月多少天
 */
export const getCurMonthDays = (y, m) => {
  if (!y && !m) {
    [y, m] = fomartDate(new Date(), '{y}-{m}-{d}').split('-')
  }
  if (y.indexOf('-') !== -1) {
    [y, m] = y.split('-')
  }
  return new Date(y, m, 0).getDate()
}

export default {
  fomartDate,
  formatTime,
  getCurMonthDays,
  pickerOptions,
  disabledDate
}
