import Vue from 'vue'
import Vuex from 'vuex'
// import createLogger from "vuex/dist/logger";
// import env from "@/utils";
import modules from './modules'
import getters from './getters'

Vue.use(Vuex)

export default new Vuex.Store({
  // strict: env.isDebug,
  modules,
  getters
  // plugins: env.isDebug ? [createLogger()] : []
})
