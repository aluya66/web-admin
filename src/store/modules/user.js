// import { login, logout } from 'api/auth'
import {
  OPERATOROBJ
} from '../contants'

import utils from 'utils'
import {
  resetRouter
} from '@/routes'

const state = {
  userInfo: utils.getStore('SET_USERINFO'),
  roles: [],
  operatorObj: OPERATOROBJ
}

const mutations = {
  SET_USERINFO: (state, userInfo) => {
    state.userInfo = Object.assign({}, userInfo)
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  }
}

const actions = {
  // user login
  login ({
    commit
  }, userInfo) {
    return new Promise((resolve, reject) => {
      const data = {
        token: 'eyJ0eXBlIjoiSldUIiwiYWxnIjoiSFMyNTYiLCJ0eXAiOiJKV1QifQ.eyJzdWIiOiJsb2dpbiIsImF1ZCI6InVzZXIiLCJuYmYiOjE1NzA2OTMxMTEsImxvZ2luTmFtZSI6InplZ2FuZyIsImlzcyI6Inlvc2FyLXVwbXMiLCJleHAiOjE1NzA3MjkxMTEsInVzZXJJZCI6MTA1LCJpYXQiOjE1NzA2OTMxMTF9.mOGJl8tX2M3kjLbbu7mkdjhNhvR0xX1_lvTXBbZniao',
        id: '5'
      }
      commit('SET_USERINFO', data)
      utils.setStore('SET_USERINFO', data)
      resolve()
    })
  },

  // get user info
  getInfo ({
    commit
  }) {
    return new Promise(resolve => {
      const data = {
        roles: state.userInfo.id
      }
      commit('SET_ROLES', data.roles)
      resolve(data)
    })
  },

  // user logout
  logout ({
    commit
  }) {
    return new Promise((resolve, reject) => {
      commit('SET_ROLES', [])
      commit('SET_USERINFO', '')
      utils.clearStore()
      resetRouter()
      resolve()
    })
  },

  // remove token
  resetToken ({
    commit
  }) {
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
