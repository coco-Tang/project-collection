import { ENV as SERVER_CONFIG } from '@app/env';
export const API = {
  /**
   * 登录/登出
   */
  // 密码登录
  LOGIN_BY_PASSWORD: SERVER_CONFIG.BASE_URL + "/open/mobile/member/login",
  // 验证码登陆
  LOGIN_BY_CODE: SERVER_CONFIG.BASE_URL + "/open/mobile/member/noteLogin",
  // 登出
  LOGOUT: SERVER_CONFIG.BASE_URL + "/open/mobile/member/logout",
  // 获取短信验证码
  GET_NOTE_VERIFY: SERVER_CONFIG.BASE_URL + "/open/mobile/member/noteVerify",
  // 获取app版本信息
  GET_APP_TYPE_INFO: SERVER_CONFIG.BASE_URL + "/open/mobile/common/checkVersion",
  // 获取账号信息
  GET_ACCOUNT_INFO: SERVER_CONFIG.BASE_URL + "/open/mobile/common/getAccountMessage",

  /**
  * 注册
  */
  // 获取验证码
  SEND_REGISTER_CODE: SERVER_CONFIG.BASE_URL + "/open/mobile/member/registerVerify",
  // 注册
  MEMBER_REGISTER: SERVER_CONFIG.BASE_URL + "/open/mobile/member/register",


  /**
   * 首页
   */
  // 关注列表
  FOLLOW_GET_LIST: SERVER_CONFIG.BASE_URL + "/open/mobile/goods/findByAttentionStatus",
  // 修改关注
  FOLLOW_UPDATE: SERVER_CONFIG.BASE_URL + "/open/mobile/goods/updateCateAttention",
  // 商品列表
  GET_GOODS_CATEGORY_TREE: SERVER_CONFIG.BASE_URL + "/open/mobile/search/queryPageGoods",
  // 资源列表
  GET_RESOURCE_LIST: SERVER_CONFIG.BASE_URL + "/open/mobile/search/findPageGoods",
  // 获取已关注列表
  GET_FOLLOWED_LIST: SERVER_CONFIG.BASE_URL + "/open/mobile/goods/findByAttentionList",
  // 获取省市区列表
  GET_CITY_LIST: SERVER_CONFIG.BASE_URL + "/open/mobile/goods/findAreaByLevel",
  // 获取厂商列表
  GET_MANUFACTURE_LIST: SERVER_CONFIG.BASE_URL + "/open/mobile/goods/findPageManufacturerByGoodsCateId",
  // 获取开市闭市时间
  GET_OPERATION_TIME: SERVER_CONFIG.BASE_URL + "/open/mobile/common/tranCalendar",
  // 根据经纬度查询所在地
  GET_CITY_BY_LOCATION: SERVER_CONFIG.BASE_URL + "/open/mobile/common/regeocoding",

  /**
    * 询价-聊天
    */
  //  获取列表
  CHAT_GET_LIST: SERVER_CONFIG.BASE_URL + "/open/mobile/enquiry/dialogueDetailList",
  // 卖家报价/调整报价/同意
  CHAT_SELLER_OPERATION: SERVER_CONFIG.BASE_URL + "/open/mobile/enquiry/sellAdjustPrice",
  // 买家拒绝
  CHAT_BUYER_REJECT: SERVER_CONFIG.BASE_URL + "/open/mobile/enquiry/buyerNoPass",
  // 买家同意
  ORDER_BUYER_AGREE: SERVER_CONFIG.BASE_URL + "/open/mobile/order/buyerEnquiryOrder",
  //查询询盘详情
  GET_ENQUIRY_INFO: SERVER_CONFIG.BASE_URL + "/open/mobile/enquiry/getEnquiryInfo/",

  CHECK_VERSION: SERVER_CONFIG.BASE_URL + "/open/checkVersion",

  //查询可购买企业
  FIND_ENTERPRISE_ORDER: SERVER_CONFIG.BASE_URL + "/open/mobile/enterprise/findEnterpriseOrder",
  //询盘申请
  SUBMIT_ENQUIRY_APPLY: SERVER_CONFIG.BASE_URL + "/open/mobile/enquiry/submitEnquiryApply",
  //查询收获地址列表
  GET_ADDRESS_LIST: SERVER_CONFIG.BASE_URL + "/open/mobile/enterprise/findAddressList",
  //新增收获地址
  ADD_ADDRESS: SERVER_CONFIG.BASE_URL + "/open/mobile/enterprise/addAddress",

  //个人中心信息
  GET_USER_INFO: SERVER_CONFIG.BASE_URL + "/open/mobile/member/getInformation",

  //获取客服电话
  GET_CUSTOMER_CALL: SERVER_CONFIG.BASE_URL + "/open/mobile/enterprise/getCustomerCall",

  //获取资源详情
  GET_RESOURCE_DETAIL: SERVER_CONFIG.BASE_URL + "/open/mobile/resource/findByResourceIdDetail",

  /* 消息 */
  GET_NOTICE_LIST: SERVER_CONFIG.BASE_URL + "/open/mobile/goods/getChatLogs",

  //合作企业
  GET_PARTNER_LIST: SERVER_CONFIG.BASE_URL + "/open/mobile/enterprise/cooperative",
  //企业列表
  GET_ENTERPRISE_LIST: SERVER_CONFIG.BASE_URL + "/open/mobile/enterprise/findListByStatus",
  //创建/修改企业信息
  CREATE_ENTERPRISE: SERVER_CONFIG.BASE_URL + "/open/mobile/enterprise/enterprise/fastCreate",
  //获取注册企业信息
  GET_ENTERPRISE_INFO: SERVER_CONFIG.BASE_URL + "/open/mobile/enterprise/fastCreate/allInfo",

  //订单列表
  GET_ORDER_LIST: SERVER_CONFIG.BASE_URL + "/open/mobile/member/buyerOrderList",
  //订单详情
  GET_ORDER_INFO: SERVER_CONFIG.BASE_URL + "/open/mobile/member/orderDetailInfo",
  //协议
  GET_CHECK_IN_PROTOCOL: SERVER_CONFIG.BASE_URL + "/open/mobile/common/findProtocolFileByType",

  //上传文件
  UPLOAD_FILE: SERVER_CONFIG.BASE_URL + "/open/file/uploadFileByType"
}
