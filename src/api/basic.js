import Http from '../utils/request'

const context = process.env.VUE_APP_CONSOLE_BASIC

/**
 * 添加业务线
 * @param {*} params
 */
export const addBusiness = params =>
  Http.fetch(`${context}/v1/application/insert`, params)

/**
 * 查询业务线详情
 * @param {*} params
 */
export const businessDetail = params =>
  Http.fetch(`${context}/bms/appliction/query/detail`, params)

/**
 * 查询业务线列表
 * @param {*} params
 */
export const businessList = params =>
  Http.fetch(`${context}/v1/application/list`, params)

/**
 * 修改业务线
 * @param {*} params
 */
export const updateBusiness = params =>
  Http.fetch(`${context}/v1/application/update`, params)

/**
 * 查询区域详情信息
 */
export const queryAreaByCode = params =>
  Http.fetch(`${context}/v1/region/by/code`, params)

/**
 * 查询区域详情信息
 */
export const queryAreaDetail = params =>
  Http.fetch(`${context}/v1/region/detail`, params)

/**
 * 根据省份等级获取区域
 */
export const queryAreaByProvince = params =>
  Http.fetch(`${context}/v1/region/list/level`, params)

/**
 * 查询区域列表
 */
export const queryAreaList = params =>
  Http.fetch(`${context}/v1/region/list`, params)

// 根据父code获取区域
export const getParentcode = params =>
  Http.fetch(`${context}/v1/region/list/parentcode`, params)

/**
 * 查询所有品类列表
 * @param {*} params
 */
export const queryCategory = params =>
  Http.fetch(`${context}/v1/category/page/list`, params)

// 添加版本信息
export const addRelease = params =>
  Http.fetch(`${context}/v1/version/insert`, params)

/**
 * 查询所有品类列表
 * @param {*} params
 */
export const queryCategoryDetail = params =>
  Http.fetch(`${context}/bms/category/query/detail`, params)

// 发布版本
export const releaseRelease = params =>
  Http.fetch(`${context}/v1/version/update`, params)

/**
 * 添加商品类目
 * @param {*} params
 */
export const addCategory = params =>
  Http.fetch(`${context}/v1/category/insert`, params)

// 修改商品类目
export const updateCategory = params =>
  Http.fetch(`${context}/v1/category/update`, params)

/**
 * 删除商品类目
 * @param {*} params
 */
export const deleteCategory = params =>
  Http.fetch(`${context}/v1/category/delete`, params)

/**
 * 查询父子结构商品类目
 * @param {*} params
 */
export const queryParentCategory = params =>
  Http.fetch(`${context}/bms/category/query/recursion/list`, params, {
    method: 'get'
  })

/**
 * 查询所有版本列表
 * @param {*} params
 */
export const queryAllVersion = params =>
  Http.fetch(`${context}/v1/version/page/list`, params)

// 区域列表
export const queryAllRegion = params =>
  Http.fetch(`${context}/v1/region/page/list`, params)

// 区域列表
export const queryAllParentcodes = params =>
  Http.fetch(`${context}/v1/region/list/parentcodes`, params)

// 区域添加
export const addRegionInsert = params =>
  Http.fetch(`${context}/v1/region/insert`, params)

// 区域修改
export const updataRegionInsert = params =>
  Http.fetch(`${context}/v1/region/update`, params)

// 品牌列表
export const brandList = params =>
  Http.fetch(`${context}/v1/brand/list`, params)

// 新增品牌
export const addBrandList = params =>
  Http.fetch(`${context}/v1/brand/add`, params)

// 修改品牌
export const updateBrandList = params =>
  Http.fetch(`${context}/v1/brand/update`, params)

// 删除品牌
export const deleteBrandList = params =>
  Http.fetch(`${context}/v1/brand/logicdelete`, params)

// 商品类型列表
export const getGoodsattrval = params =>
  Http.fetch(`${context}/v1/goodsattr/listpage`, params)

// 商品类型新增
export const addGoodsattrval = params =>
  Http.fetch(`${context}/v1/goodsattr/addval`, params)

// 商品类型修改
export const updateGoodsattrval = params =>
  Http.fetch(`${context}/v1/goodsattr/update`, params)

// 商品类型删除
export const deleteGoodsattrval = params =>
  Http.fetch(`${context}/v1/goodsattr/logicdelete`, params)

// 标签列表
export const getQuerypage = params =>
  Http.fetch(`${context}/v1/label/list`, params)

// 标签新增
export const addQuerypage = params =>
  Http.fetch(`${context}/v1/label/add`, params)

// 标签更新
export const updateQuerypage = params =>
  Http.fetch(`${context}/v1/label/update`, params)

// 标签删除
export const deleteQuerypage = params =>
  Http.fetch(`${context}/v1/label/physicaldelete`, params)

// 标签分类/风格
export const addSoreQuerypage = params =>
  Http.fetch(`${context}/v1/labelcategory/querypage`, params)

// 物流列表
export const getLogistics = params =>
  Http.fetch(`${context}/v1/logistics/list`, params)

// 新增物流
export const addLogistics = params =>
  Http.fetch(`${context}/v1/logistics/add`, params)

// 更新物流
export const updateLogistics = params =>
  Http.fetch(`${context}/v1/logistics/update`, params)

// 物流详情
export const getLogisticsDel = params =>
  Http.fetch(`${context}/v1/logistics/add`, params)

// 商品中心风格、sku
export const getStyle = params =>
  Http.fetch(`${context}/v1/goodsattr/listpage`, params)
