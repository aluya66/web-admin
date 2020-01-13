const utils = require('../utils.js')

module.exports = {
  description: 'generate api service',
  prompts: [
    {
      type: 'input',
      name: 'name',
      message: 'What\'s your component name?',
      validate: utils.notEmpty('name')
    },
    {
      type: 'input',
      name: 'context',
      message: 'What\'s your context path of this service?',
      default: 'CONSOLE_COMMON'
    }
  ],

  actions: data => {
    const name = '{{camelCase name}}'

    const actions = [{
      type: 'add',
      path: `${utils.path.api}${name}.js`,
      templateFile: 'plop-rules/api/basic.hbs'
    }]

    return actions
  }
}
