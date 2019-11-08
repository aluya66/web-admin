import { login, logout, getMenuList } from 'api/common'

import utils from 'utils'
import { resetRouter } from '@/routes'

const state = {
  userInfo: utils.getStore('SET_USERINFO'),
  roles: null // 菜单id
}

const mutations = {
  SET_USERINFO: (state, userInfo) => {
    state.userInfo = userInfo
  },
  SET_ROLES: (state, role) => {
    state.roles = role
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
        // 默认system用户角色id为0,中台默认5
        utils.setStore('SET_USERINFO', data)
        getMenuList({ parentId: 0 }).then(res => {
          const curMenu = res.find(item => item.path.indexOf('pillar-console.yosar') !== -1 || item.title.indexOf('中台') === 0)
          if (curMenu) {
            commit('SET_USERINFO', { ...data, id: curMenu.id })
            utils.setStore('SET_USERINFO', { ...data, id: curMenu.id })
          }
          resolve()
        })
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
