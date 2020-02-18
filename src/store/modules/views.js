// import utils from 'utils'
import { queryDictByCodes } from 'api/settings'
import { businessList } from 'api/basic'
import utils from 'utils'

const state = {
  dictList: [], // 字典
  appList: [] // 业务线
}

const mutations = {
  SET_DICTLIST: (state, val) => {
    state.dictList = val
  },
  SET_APPCODE: (state, val) => {
    state.appList = val
  }
}

const actions = {
  /**
   * 获取字典数据
   */
  getDict({ commit }, params) {
    return new Promise(resolve => {
      const curParams = {
        codes: params.codes.join(','),
        dictLob: params.dictLob
      }
      queryDictByCodes(curParams).then(val => {
        const data = val || []
        const dictObj = {}
        data.forEach(res => {
          dictObj[res.dictCode] = res.values.map(dict => ({
            label: dict.dictValue,
            value: dict.id
          }))
        })
        // console.log(dictObj)
        commit('SET_DICTLIST', dictObj)
        resolve(dictObj)
      })
    })
  },
  /**
   * 获取开启的业务线
   */
  getAppCodeList({ commit }, params) {
    if (!params) {
      params = {
        status: 1,
        pageNo: 1,
        pageSize: 100
      }
    }
    return new Promise(resolve => {
      businessList(params, { cache: 'GLOBALAPPLIST' }).then(res => {
        let appList = []
        const { data } = res
        if (data && data.length) {
          appList = data.map(val => ({
            label: val.appName,
            value: val.appCode
          }))
          utils.setStore('GLOBALAPPLIST', appList)
        }
        commit('SET_APPCODE', appList)
        resolve(appList)
      })
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
