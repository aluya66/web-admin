import Http from '../utils/request'

const context = process.env.VUE_APP_CONSOLE_COMMON

/**
 * @param {*} 会员列表
 */
export const getMember = params =>
  Http.fetch(`${context}/api/member/list`, params, {
    method: 'get',
    mockFile: 'member-list'
  })

// 修改会员
export const updateMember = params =>
  Http.fetch(`${context}/api/member`, params, {
    method: 'put'
  })

// 修改余额
export const updateBalance = params =>
  Http.fetch(`${context}/api/member/balance`, params, {
    method: 'put'
  })

// 修改积分
export const updatePoint = params =>
  Http.fetch(`${context}/api/member/point`, params, {
    method: 'put'
  })

// 会员详情
export const getMemberDetail = params =>
  Http.fetch(`${context}/api/member/detail`, params, {
    method: 'get',
    mockFile: 'member-detail'
  })

/**
 * @param {*} 用户管理列表-登录列表
 */
export const getMemberLoginlog = params =>
  Http.fetch(`${context}/api/loginlog/list`, params, {
    method: 'get',
    mockFile: 'member-loginlog'
  })

/**
 * @param {*} 会员钱包列表
 */
export const getWallet = params =>
  Http.fetch(`${context}/api/wallet/list`, params, {
    method: 'get',
    mockFile: 'member-wallet'
  })

/**
 * @param {*} 收入明细列表-会员钱包
 */
export const getWalletList = params =>
  Http.fetch(`${context}/api/wallet/revenuelist`, params, {
    method: 'get',
    mockFile: 'member-walletList'
  })

/**
 * @param {*} 积分列表
 */
export const getPoint = params =>
  Http.fetch(`${context}/api/pointlog/list`, params, {
    method: 'get',
    mockFile: 'member-point'
  })

/**
 * @param {*} 积分规则列表-积分配置
 */
export const getPointRule = params =>
  Http.fetch(`${context}/api/pointrule/list`, params, {
    method: 'get',
    mockFile: 'member-pointrule'
  })

// 新增积分规则-积分配置
export const addPointRule = params =>
  Http.fetch(`${context}/api/pointrule/add`, params, {
    method: 'post',
    mockFile: 'member-add'
  })

// 编辑积分规则-积分配置
export const updatePointRule = params =>
  Http.fetch(`${context}/api/pointrule/update`, params, {
    method: 'put',
    mockFile: 'member-update'
  })

/**
 * @param {*}  会员规则列表-规则配置
 */
export const getMemberRule = params =>
  Http.fetch(`${context}/api/member/rule/list`, params, {
    method: 'get',
    mockFile: 'member-memberrule'
  })

// 新增会员规则-规则配置
export const addMemberRule = params =>
  Http.fetch(`${context}/api/member/rule`, params, {
    method: 'post',
    mockFile: 'member-add'
  })

// 编辑会员规则-规则配置
export const updateMemberRule = params =>
  Http.fetch(`${context}/api/member/rule`, params, {
    method: 'put',
    mockFile: 'member-update'
  })

/**
 * @param {*}  会员类型列表-类型配置
 */
export const getMemberType = params =>
  Http.fetch(`${context}/api/member/type/list`, params, {
    method: 'get',
    mockFile: 'member-membertype'
  })

// 新增会员类型-类型配置
export const addMemberType = params =>
  Http.fetch(`${context}/api/member/type`, params, {
    method: 'post',
    mockFile: 'member-add'
  })

// 编辑会员类型-类型配置
export const updateMemberType = params =>
  Http.fetch(`${context}/api/member/type`, params, {
    method: 'put',
    mockFile: 'member-update'
  })

/**
 * 获取已启用的会员类型数据
 * @param {*} params
 */
export const getMemberListType = params =>
  Http.fetch(`${context}/api/member/type/query`, params, {
    method: 'get'
  })

/**
 * 会员权益列表
 * @param {*} params
 */
export const getMemberEquityList = params =>
  Http.fetch(`${context}/api/member/activity/list`, params, {
    method: 'get'
  })

/**
 * 会员权益编辑
 * @param {*} params
 */
export const editMemberEquity = params =>
  Http.fetch(`${context}/api/member/activity`, params, {
    method: 'put'
  })

/**
 * 导出会员积分
 * @param {*} params
 */
export const exportPoint = params =>
  Http.fetch(`${context}/api/pointlog/export`, params, {
    method: 'get',
    responseType: 'arraybuffer',
    hasErrMsg: true
  })

/**
 * 导出会员列表
 * @param {*} params
 */
export const exportMember = params =>
  Http.fetch(`${context}/api/member/export`, params, {
    method: 'get',
    responseType: 'arraybuffer',
    hasErrMsg: true
  })
