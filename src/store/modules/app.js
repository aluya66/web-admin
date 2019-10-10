/* eslint-disable no-self-assign */
import utils from 'utils'

const state = {
  sidebar: {
    opened: utils.getCookie('sidebarStatus')
      ? !!+utils.getCookie('sidebarStatus')
      : true,
    withoutAnimation: false
  },
  device: 'desktop',
  language: 'zh-cn',
  typeStatus: 0
}

const mutations = {
  TARGET_STATUS: (state, status) => {
    state.typeStatus = status
  },
  TOGGLE_SIDEBAR: state => {
    state.sidebar.opened = !state.sidebar.opened
    state.sidebar.withoutAnimation = false
    if (state.sidebar.opened) {
      utils.setCookie('sidebarStatus', 1)
    } else {
      utils.setCookie('sidebarStatus', 0)
    }
  },
  CLOSE_SIDEBAR: (state, withoutAnimation) => {
    utils.setCookie('sidebarStatus', 0)
    state.sidebar.opened = false
    state.sidebar.withoutAnimation = withoutAnimation
  },
  TOGGLE_DEVICE: (state, device) => {
    state.device = device
  }
}

const actions = {
  toggleSideBar ({ commit }) {
    commit('TOGGLE_SIDEBAR')
  },
  closeSideBar ({ commit }, { withoutAnimation }) {
    commit('CLOSE_SIDEBAR', withoutAnimation)
  },
  toggleDevice ({ commit }, device) {
    commit('TOGGLE_DEVICE', device)
  },
  targetStatus ({ commit }, status) {
    commit('TARGET_STATUS', status)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
