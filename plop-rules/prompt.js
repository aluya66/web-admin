const utils = require('./utils.js')

module.exports = {
  description: 'generate a view page',
  prompts: [
    {
      type: 'input',
      name: 'name',
      message: 'What\'s your modules(api、route、view) name?',
      validate: utils.notEmpty('name')
    },
    {
      type: 'input',
      name: 'context',
      message: 'What\'s your context path of this service?',
      default: 'CONSOLE_COMMON'
    },
    {
      type: 'input',
      name: 'apiFile',
      message: 'What\'s your name of api file import view page?',
      validate: utils.notEmpty('apiFile')
    },
    {
      type: 'confirm',
      name: 'pageType',
      message: 'Do you want dialog of view page?'
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
    let actions = [
      {
        type: 'add',
        path: `${utils.path.api}${name}.js`,
        templateFile: 'plop-rules/api/basic.hbs'
      },
      {
        type: 'add',
        path: `${utils.path.routes}${name}.js`,
        templateFile: 'plop-rules/routes/basic.hbs'
      }
    ]
    let dynamicActions = []
    if (data.pageType) {
      dynamicActions = [{
        type: 'add',
        path: `${utils.path.views}${name}/list.vue`,
        templateFile: templateFileAdapter['list-dialog'] || templateFileAdapter.default
      },
      {
        type: 'add',
        path: `${utils.path.views}${name}/add.vue`,
        templateFile: templateFileAdapter['form-dialog'] || templateFileAdapter.default
      }]
    } else {
      dynamicActions = [{
        type: 'add',
        path: `${utils.path.views}${name}/list.vue`,
        templateFile: templateFileAdapter['list-basic'] || templateFileAdapter.default
      },
      {
        type: 'add',
        path: `${utils.path.views}${name}/detail/index.vue`,
        templateFile: templateFileAdapter['form-basic'] || templateFileAdapter.default
      }]
    }
    actions = actions.concat(dynamicActions)

    return actions
  }
}
