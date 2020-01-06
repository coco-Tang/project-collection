import { Injectable } from '@angular/core';

import { API } from '../../config/api';
import { Helper } from '../../utils/helper';

import { HttpService } from '../../services/http.service';


@Injectable()
export class HomeService {

	constructor(private httpService: HttpService, private helper: Helper) {

	}

	// 货期枚举
	TRANSACTION_REFERENCE: any = [{
		name: '远期',
		value: '2',
	}, {
		name: '现货',
		value: '0'
	}]

	// 获取城市列表
	getCityList (params) {
		return this.httpService.post(API.GET_CITY_LIST, params, {
			defaultHandleError: true,
			rejectError: false
		});
	}

	// 获取厂商列表
	getManufactureList (params) {
		return this.httpService.post(API.GET_MANUFACTURE_LIST, params, {
			defaultHandleError: true,
			rejectError: false
		});
	}

	// 获取开闭市时间
	getOperationTime () {
		return this.httpService.get(API.GET_OPERATION_TIME, {
			defaultHandleError: true,
			rejectError: false
		})
	}

	// 根据经纬度获取所在城市
	getCurrentCityByLocation (params) {
		return this.httpService.get(this.helper.URL.getUrl(API.GET_CITY_BY_LOCATION, params), {
			defaultHandleError: true,
			rejectError: false
		})
	}
}

