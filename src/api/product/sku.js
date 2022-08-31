//获取SKU数据接口的模块
import request from '@/utils/request'

//获取sku列表数据 GET /admin/product/list/{page}/{limit}
export const reqSkuList = (page, limit) => request({url: `/admin/product/list/${page}/${limit}`, method: 'get'})

//上架  GET /admin/product/onSale/{skuId}
export const reqSale = (skuId) => request({url: `/admin/product/onSale/${skuId}`, method: 'get'})

//下架 GET /admin/product/cancelSale/{skuId}
export const reqCancelSale = (skuId) => request({url: `/admin/product/cancelSale/${skuId}`, method: 'get'})

//获取sku详情数据 GET /admin/product/getSkuById/{skuId}
export const reqGetSkuById = (skuId) => request({url: `/admin/product/getSkuById/${skuId}`, method: 'get'})