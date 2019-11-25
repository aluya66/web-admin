// import utils from 'utils'
import { queryDictByCodes } from 'api/settings'

const state = {
  dictList: []
}

const mutations = {
  SET_DICTLIST: (state, val) => {
    state.dictList = val
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
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
