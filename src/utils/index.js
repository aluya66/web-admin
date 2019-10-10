import libs from './libs'
import create from './create'
import transModules from './libs/transModules'
import base from './base'
import scrollTo from './scroll-to'
import validate from './validate'

export default {
  create,
  transModules,
  scrollTo,
  ...base,
  ...libs,
  ...validate
}
