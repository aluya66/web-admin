const viewsGenerator = require('./plop-rules/views/prompt')
const routesGenerator = require('./plop-rules/routes/prompt')
const componentsGenerator = require('./plop-rules/components/prompt')
const apiGenerator = require('./plop-rules/api/prompt')
const modulesGenerator = require('./plop-rules/prompt')
// const storeGenerator = require('./plop-rules/store/prompt')
// const utilsGenerator = require('./plop-rules/utils/prompt')

module.exports = function (plop) {
  plop.setGenerator('module', modulesGenerator)
  plop.setGenerator('api', apiGenerator)
  plop.setGenerator('route', routesGenerator)
  plop.setGenerator('view', viewsGenerator)
  plop.setGenerator('component', componentsGenerator)

  // plop.setGenerator('store', storeGenerator)
  // plop.setGenerator('util', utilsGenerator)
}
