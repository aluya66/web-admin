import { login, logout } from 'api/common'

import utils from 'utils'
import { resetRouter } from '@/routes'

const state = {
  userInfo: utils.getStore('SET_USERINFO'),
  roles: []
}

const mutations = {
  SET_USERINFO: (state, userInfo) => {
    state.userInfo = userInfo
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  }
}

const actions = {
  // user login
  login({ commit }, params) {
    const {
      userName,
      password
    } = params
    return new Promise((resolve, reject) => {
      login({
        userName: userName,
        password: utils.encrypt(password)
      }).then(data => {
        // 默认system用户角色id为0
        const curData = { ...data, id: 0 }
        commit('SET_USERINFO', curData)
        utils.setStore('SET_USERINFO', curData)
        resolve()
      })
    })
  },

  // get user info
  getInfo({ commit }) {
    return new Promise(resolve => {
      let role = utils.getUrlParam('parentId')
      const data = {
        roles: role || state.userInfo.id
      }
      commit('SET_ROLES', data.roles)
      resolve(data)
    })
  },

  // user logout
  logout({ commit }) {
    return new Promise((resolve, reject) => {
      logout()
        .then(() => {
          commit('SET_ROLES', [])
          commit('SET_USERINFO', '')
          utils.clearStore()
          resetRouter()
          resolve()
        }).catch(err => {
          reject(err)
        })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_ROLES', [])
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
