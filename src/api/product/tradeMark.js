//品牌管理模块的api接口
import request from '@/utils/request'

//获取品牌列表接口   /admin/product/baseTrademark/{page}/{limit}  get请求
export const reqGetTradeMarkList = (page, limit) => request({url: `/admin/product/baseTrademark/${page}/${limit}`, method: 'get'})


//添加品牌接口  /admin/product/baseTrademark/save   post请求  携带两个参数：品牌名称、品牌logo
//切记：对于新增的品牌，给服务器传递数据，不需要传递ID，ID是由服务器生成

//修改品牌接口  /admin/product/baseTrademark/update   put请求  携带三个参数：id、品牌名称、品牌logo
//切记：对于修改某一个品牌的操作，前端携带的参数需要带上id，你需要告诉服务器修改的是哪一个品牌

export const reqAddOrUpdateTradeMark = (tradeMark) => {
  if(tradeMark.id) {
    //带有id，修改操作
    return request({url: '/admin/product/baseTrademark/update', method: 'put', data: tradeMark})
  } else {
    //添加操作
    return request({url: '/admin/product/baseTrademark/save', method: 'post', data: tradeMark})
  }
}

//删除品牌接口  /admin/product/baseTrademark/remove/{id}  delete
export const reqDeleteTradeMark = (id) => request({url: `/admin/product/baseTrademark/remove/${id}`, method: 'delete'})