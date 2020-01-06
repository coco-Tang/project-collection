import { Injectable } from '@angular/core';

import { API } from '../../config/api';

import { HttpService } from '../../services/http.service';

@Injectable()
export class ResourceService {
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

	// 资源类型枚举
	TRANSACTION_TYPE_ENUM: any = [
		{
			id: '0',
			value: '现货'
		},
		{
			id: '1',
			value: '期货'
		},
		{
			id: '2',
			value: '远期'
		}
	]

	getResourceList(params) {
		return this.httpService.post(API.GET_RESOURCE_LIST, params);
	}

	getResourceDetail(resourceId) {
		return this.httpService.get(API.GET_RESOURCE_DETAIL + "?resourceId=" + resourceId, {
			defaultHandleError: true,
			rejectError: true
		});
	}
}
