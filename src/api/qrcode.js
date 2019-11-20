import Http from '../utils/request'

const context = process.env.VUE_APP_CONSOLE_COMMON

// 二维码管理列表
export const getQrcodeList = params =>
	Http.fetch(`${context}/api/qrcode/queryqrcodepage`, params, {
		method: 'get'
	})

// 二维码启用/禁用, 或者说已审核, 未审核状态的修改
export const changeStatus = params =>
	Http.fetch(`${context}/api/qrcode/changestatus`, params, {
		method: 'put'
	})

// 新增, 异步校验是否存在相同的qrCode使用的接口
export const checkQrcode = params =>
	Http.fetch(`${context}/api/qrcode/checkqrcode`, params, {
		method: 'get'
	})

// 新增二维码数据
export const saveQrcode = params =>
	Http.fetch(`${context}/api/qrcode/save`, params, {
		method: 'post'
	})

// 根据ID逻辑删除二维码数据
export const deleteQrcode = params =>
	Http.fetch(`${context}/api/qrcode/delete`, params, {
		method: 'delete'
	})

// 編輯二维码
export const updateQrcode = params =>
	Http.fetch(`${context}/api/qrcode/update`, params, {
		method: 'put'
	})