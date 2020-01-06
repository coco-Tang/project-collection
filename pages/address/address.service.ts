import { Injectable } from '@angular/core';

import { API } from '../../config/api';

import { HttpService } from '../../services/http.service';

@Injectable()
export class AddressService {
	constructor(private httpService: HttpService) {

	}

	//查询地址列表
	getAddress(enterpriseId) {
		return this.httpService.get(API.GET_ADDRESS_LIST + "?enterpriseId=" + enterpriseId, {
			defaultHandleError: true,
			rejectError: true
		});
	}
}