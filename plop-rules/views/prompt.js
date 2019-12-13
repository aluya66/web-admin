const utils = require('../utils.js')

module.exports = {
  description: 'generate a view page',
  prompts: [
    {
      type: 'input',
      name: 'name',
      message: 'What\'s your view page template name?',
      validate: utils.notEmpty('name')
    },
    {
      type: 'input',
      name: 'pathName',
      message: 'What\'s your view page add path?'
    },
    {
      type: 'input',
      name: 'apiFile',
      message: 'What\'s your apiFile name?',
      validate: utils.notEmpty('apiFile')
    },
    {
      type: 'list',
      name: 'type',
      message: 'Which type of view page template are you want?',
      choices: ['list-basic', 'list-dialog', 'form-basic', 'form-dialog']
    }
  ],
  actions: data => {
    const name = '{{camelCase name}}'

    const templateFileAdapter = {
      'list-basic': 'plop-rules/views/list/basic.hbs',
      'list-dialog': 'plop-rules/views/list/decorator.hbs',
      'form-basic': 'plop-rules/views/form/basic.hbs',
      'form-dialog': 'plop-rules/views/form/decorator.hbs',
      default: 'plop-rules/views/basic.hbs'
    }
    const actions = [
      {
        type: 'add',
        path: `${utils.path.views}${name}/${data.pathName ? data.pathName + '/' : ''}${data.type.indexOf('list') !== -1 ? 'list' : data.type.indexOf('form-dialog') !== -1 ? 'add' : 'detail/index'}.vue`,
        templateFile: templateFileAdapter[data.type] || templateFileAdapter.default
      }
    ]

    return actions
  }
}
