//平台属性管理的api接口
import request from '@/utils/request'

//一级分类  /admin/product/getCategory1 Get请求
export const reqCategory1List = () => request({url: '/admin/product/getCategory1', method: 'get'})

//二级分类 /admin/product/getCategory2/{category1Id} Get请求
export const reqCategory2List = (category1Id) => request({url: `/admin/product/getCategory2/${category1Id}`, method: 'get'})

//三级分类 /admin/product/getCategory3/{category2Id} Get请求
export const reqCategory3List = (category2Id) => request({url: `/admin/product/getCategory3/${category2Id}`, method: 'get'})

//获取平台属性列表数据 /admin/product/attrInfoList/{category1Id}/{category2Id}/{category3Id} Get请求
export const reqGetAttrList = (category1Id, category2Id, category3Id) => request({url: `/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`, method: 'get'})

//保存平台属性  /admin/product/saveAttrInfo Post请求
/**
 * {
    "attrName": "string",
    "attrValueList": [
      {
        "attrId": 0,
        "valueName": "string"
      }
    ],
    "categoryId": 0,
    "categoryLevel": 0,
    }
 */
export const reqAddOrUpdateAttrInfo = (data) => request({url: '/admin/product/saveAttrInfo', method: 'post', data})