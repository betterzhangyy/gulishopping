//spu管理模块的api接口
import request from '@/utils/request'

//获取spu列表数据 GET /admin/product/{page}/{limit}  参数：page limit category3Id
export const reqGetSpuList = (page, limit, category3Id) => request({url: `/admin/product/${page}/${limit}`, method: 'get', params: {category3Id}})

//获取某一个SPU信息  GET /admin/product/getSpuById/{spuId} 
export const reqGetSpuById = (spuId) => request({url: `/admin/product/getSpuById/${spuId}`, method: 'get'})

//获取品牌数据 GET /admin/product/baseTrademark/getTrademarkList
export const reqTradeMarkList = () => request({url: '/admin/product/baseTrademark/getTrademarkList', method: 'get'})

//获取SPU图片  GET /admin/product/spuImageList/{spuId}
export const reqSpuImageList = (spuId) => request({url: `/admin/product/spuImageList/${spuId}`, method: 'get'})

//获取平台中全部的销售属性 GET /admin/product/baseSaleAttrList
export const reqSaleAttrList = () => request({url: '/admin/product/baseSaleAttrList', method: 'get'})

//添加|修改SPU信息  POST /admin/product/saveSpuInfo   POST /admin/product/updateSpuInfo
export const reqAddOrUpdateSpu = (spuInfo) => {
  if(spuInfo.id) {
    //修改接口
    return request({url: '/admin/product/updateSpuInfo', method: 'post', data: spuInfo})
  } else {
    return request({url: '/admin/product/saveSpuInfo', method: 'post', data: spuInfo})
  }
}

//删除SPU  DELETE /admin/product/deleteSpu/{spuId}
export const reqDeleteSpu = (spuId) => request({url: `/admin/product/deleteSpu/${spuId}`, method: 'delete'})

//获取spu图片列表数据的接口 GET /admin/product/spuImageList/{spuId}
export const reqSpuImageInfo = (spuId) => request({url: `/admin/product/spuImageList/${spuId}`, method: 'get'})

//获取spu销售属性列表数据的接口 GET /admin/product/spuSaleAttrList/{spuId}
export const reqSpuSaleAttrList = (spuId) => request({url: `/admin/product/spuSaleAttrList/${spuId}`, method: 'get'})

//获取平台属性列表数据的接口 GET /admin/product/attrInfoList/{category1Id}/{category2Id}/{category3Id}
export const reqAttrInfoList = (category1Id, category2Id, category3Id) => request({url: `/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`, method: 'get'})

//保存SKU信息  POST /admin/product/saveSkuInfo 参数skuInfo 
export const reqSaveSkuInfo = (skuInfo) => request({url: '/admin/product/saveSkuInfo', method: 'post', data: skuInfo})

//获取spu所有的sku的数据 GET /admin/product/findBySpuId/{spuId}
export const reqGetSkuList = (spuId) => request({url: `/admin/product/findBySpuId/${spuId}`, method: 'get'})