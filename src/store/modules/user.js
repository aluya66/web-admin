// import { login, logout } from 'api/auth'

import utils from 'utils'
import {
  resetRouter
} from '@/routes'

const state = {
  userInfo: utils.getStore('SET_USERINFO'),
  roles: []
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
        token: 'eyJ0eXBlIjoiSldUIiwiYWxnIjoiSFMyNTYiLCJ0eXAiOiJKV1QifQ.eyJzdWIiOiJsb2dpbiIsImF1ZCI6InVzZXIiLCJuYmYiOjE1NzA3NTcyNzAsImxvZ2luTmFtZSI6Imh1YW5nIiwiaXNzIjoieW9zYXItdXBtcyIsImV4cCI6MTU3MDc5MzI3MCwidXNlcklkIjo5NCwiaWF0IjoxNTcwNzU3MjcwfQ.5PQxjCesKgzvgKrV5jCVDkHIRmLsgS3RyFlfZiftCEM',
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
