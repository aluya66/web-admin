import Http from '../utils/request'

const context = process.env.VUE_APP_CONSOLE_COMMON

/**
 * 添加业务线
 * @param {*} params
 */
export const addBusiness = params =>
  Http.fetch(`${context}/api/app`, params)

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
  Http.fetch(`${context}/api/app/list`, params, {
    method: 'get'
  })

/**
 * 修改业务线
 * @param {*} params
 */
export const updateBusiness = params =>
  Http.fetch(`${context}/api/app`, params, {
    method: 'put'
  })

/**
 * 查询区域详情信息
 */
export const queryAreaByCode = params =>
  Http.fetch(`${context}/api/region/by/code`, params)

/**
 * 查询区域详情信息
 */
export const queryAreaDetail = params =>
  Http.fetch(`${context}/api/region/detail`, params)

/**
 * 根据省份等级获取区域
 */
export const queryAreaByProvince = params =>
  Http.fetch(`${context}/api/region/list/level`, params)

/**
 * 查询区域列表
 */
export const queryAreaList = params =>
  Http.fetch(`${context}/api/region/list`, params)

// 根据父code获取区域
export const getParentcode = params =>
  Http.fetch(`${context}/api/region/list/parentcode`, params)

/**
 * 查询所有类目列表
 * @param {*} params
 */
export const queryCategory = params =>
  Http.fetch(`${context}/api/category/recursions`, params, {
    method: 'get'
  })

/**
 * 查询所以商品类目数据
 */
export const queryCategoryAll = params =>
  Http.fetch(`${context}/api/category/recursions`, params, {
    method: 'get'
  })

// 添加版本信息
export const addRelease = params =>
  Http.fetch(`${context}/api/version`, params)

/**
 * 查询所有品类列表
 * @param {*} params
 */
export const queryCategoryDetail = params =>
  Http.fetch(`${context}/bms/category/query/detail`, params)

// 发布版本
export const releaseRelease = params =>
  Http.fetch(`${context}/api/version`, params, {
    method: 'put'
  })

/**
 * 添加商品类目
 * @param {*} params
 */
export const addCategory = params =>
  Http.fetch(`${context}/api/category`, params)

// 修改商品类目
export const updateCategory = params =>
  Http.fetch(`${context}/api/category`, params, {
    method: 'put'
  })

/**
 * 删除商品类目
 * @param {*} params
 */
export const deleteCategory = params =>
  Http.fetch(`${context}/api/category`, params, {
    // Http.fetch(`${context}/api/category/${params.categoryId}`, params, {
    method: 'delete'
  })

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
  Http.fetch(`${context}/api/version/list`, params, {
    method: 'get'
  })

// 区域列表
export const getAreaAll = params =>
  Http.fetch(`${context}/api/area/all`, params, {
    method: 'get',
    cache: 'area'
  })

// 区域列表
export const queryAllRegion = params =>
  Http.fetch(`${context}/api/area/childrens`, params, {
    method: 'get'
  })

// 区域添加
export const addRegionInsert = params =>
  Http.fetch(`${context}/api/area`, params)

// 区域修改
export const updataRegionInsert = params =>
  Http.fetch(`${context}/api/area`, params, {
    method: 'put'
  })

// 删除区域信息
export const deleteArea = params =>
  Http.fetch(`${context}/api/area`, params, {
    method: 'detele'
  })

// 品牌列表
export const brandList = params =>
  Http.fetch(`${context}/api/brand/querypage`, params, {
    method: 'get'
  })

// 根据id查询品牌
export const getBrandById = params =>
  Http.fetch(`${context}/api/brand`, params, {
    method: 'get'
  })

// 新增品牌
export const addBrand = params =>
  Http.fetch(`${context}/api/brand`, params)

// 修改品牌
export const updateBrand = params =>
  Http.fetch(`${context}/api/brand`, params, {
    method: 'put'
  })

// 删除品牌
export const deleteBrand = params =>
  Http.fetch(`${context}/api/brand`, params, {
    method: 'delete'
  })

// 商品类型列表
export const getGoodsattrval = params =>
  Http.fetch(`${context}/api/attr/querypage`, params, {
    method: 'get'
  })

// 商品类型新增
export const addGoodsattrval = params =>
  Http.fetch(`${context}/api/attr/addall`, params)

// 商品类型修改
export const updateGoodsattrval = params =>
  Http.fetch(`${context}/api/attr`, params, {
    method: 'put'
  })

// 商品类型删除
export const deleteGoodsattrval = params =>
  Http.fetch(`${context}/api/attr`, params, {
    method: 'delete'
  })

// 标签列表
export const getQuerypage = params =>
  Http.fetch(`${context}/api/label/querypage`, params, {
    method: 'get'
  })

// 标签新增
export const addQuerypage = params =>
  Http.fetch(`${context}/api/label`, params)

// 标签更新
export const updateQuerypage = params =>
  Http.fetch(`${context}/api/label`, params, {
    method: 'put'
  })

// 标签删除
export const deleteQuerypage = params =>
  Http.fetch(`${context}/api/label/logicdelete`, params, {
    method: 'delete'
  })

// 标签分类/风格
export const addSoreQuerypage = params =>
  Http.fetch(`${context}/api/labelcategory/querypage`, params, {
    method: 'get'
  })

// 物流列表
export const getLogistics = params =>
  Http.fetch(`${context}/api/logistics/list`, params, {
    method: 'get'
  })

// 新增物流
export const addLogistics = params =>
  Http.fetch(`${context}/api/logistics`, params)

// 更新物流
export const updateLogistics = params =>
  Http.fetch(`${context}/api/logistics`, params, {
    method: 'put'
  })

// 物流详情
export const getLogisticsDel = params =>
  Http.fetch(`${context}/api/logistics`, params)

// 商品中心风格、sku
export const getStyle = params =>
  Http.fetch(`${context}/api/attr/querypage`, params, {
    method: 'get'
  })
