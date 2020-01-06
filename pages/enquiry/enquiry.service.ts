import { Injectable } from '@angular/core';

import { API } from '../../config/api';

import { HttpService } from '../../services/http.service';

@Injectable()
export class EnquiryService {
	constructor(private httpService: HttpService) {

	}

	//页面标题枚举
	TITLES: any = [
		{
			id: "0",
			value: "购买数量"
		}, {
			id: "1",
			value: "期望价格"
		}, {
			id: "2",
			value: "支付方式"
		}, {
			id: "3",
			value: "购买企业"
		}
		, {
			id: "4",
			value: "物流方式"
		}
		, {
			id: "5",
			value: "配送方式"
		}
	]

	//物流方式枚举
	DELIVERY_MODE: any = [
		{
			id: "S",
			value: "自提"
		}, {
			id: "T",
			value: "配送"
		}
	]

	//付款方式枚举
	PAYMENT_TYPE: any = [
		{
			id: "1",
			value: "款到发货"
		}, {
			id: "2",
			value: "企业授信"
		}, {
			id: "3",
			value: "货到30天付款"
		}
	]

	// 配送方式枚举
	TRANSPORTATION = [
		{
			id: 'A',
			value: '汽运'
		},
		{
			id: 'B',
			value: '船运'
		}
	]

	// 支付方式
	PAYMENT_METHOD = [
		{
			id: '1',
			value: '线上支付'
		},
		{
			id: '2',
			value: '线下支付'
		}
	]


	// 用户操作枚举 
	OPERATION_ENUM: any = {
		AGREE: 'AGREE', //同意
		ADJUST_AN_OFFER: 'ADJUST_AN_OFFER', //调整报价
		OFFER: 'OFFER', //报价
		UNPASS: 'UNPASS', // 拒绝
		AGREE_AND_PLACE_ORDERS: 'AGREE_AND_PLACE_ORDERS' // 同意并下单
	}

	// 卖家报价、调整报价、同意
	BUYER_OPERATION: any = {
		agree: 1,
		quote: 2,
		adjust: 3
	}

	// 获取聊天列表
	getChatList (params) {
		return this.httpService.post(API.CHAT_GET_LIST, params);
	}

	// 卖家报价/调整报价/同意
	sellerOperation (params) {
		return this.httpService.post(API.CHAT_SELLER_OPERATION, params);
	}

	// 买家拒绝
	buyerReject (params) {
		return this.httpService.post(API.CHAT_BUYER_REJECT, params);
	}

	//获取可购买企业
	getEnterprise (params) {
		return this.httpService.post(API.FIND_ENTERPRISE_ORDER, params, {
			defaultHandleError: false,
			rejectError: false
		});
	}

	//发起询盘申请
	submitEnquiryApply (params) {
		return this.httpService.post(API.SUBMIT_ENQUIRY_APPLY, params, {
			defaultHandleError: true,
			rejectError: true
		});
	}

	//询盘详情
	getEnquiryDetail (enquiryId) {
		return this.httpService.get(API.GET_ENQUIRY_INFO + enquiryId, {
			defaultHandleError: true,
			rejectError: true
		});
	}
}