import { Injectable } from '@angular/core';
import { API } from '../../config/api';

import { HttpService } from '../../services/http.service'

@Injectable()
export class OrderService {
	constructor(private httpService: HttpService) {

	}
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

	//订单状态枚举
	ORDER_STATUS: any = [
		{
			id: "1",
			value: "待签合同"
		}, {
			id: "2",
			value: "待付款"
		}, {
			id: "3",
			value: "取消"
		}, {
			id: "4",
			value: "待发货"
		}, {
			id: "99",
			value: "已完成"
		}
	]

	//获取订单详情
	getOrderDetail (params) {
		return this.httpService.post(API.GET_ORDER_INFO, params);
	}

	//同意并下单
	gotoOrder (params) {
		return this.httpService.post(API.ORDER_BUYER_AGREE, params, {
			defaultHandleError: true,
			rejectError: true
		});
	}
	getOrderList (params) {
		return this.httpService.post(API.GET_ORDER_LIST, params);
	}
}