import { Injectable } from '@angular/core';

import { API } from '../../config/api';

import { HttpService } from '../../services/http.service';

@Injectable()
export class UserService {
	constructor(private httpService: HttpService) {

	}

	getUserInfo() {
		return this.httpService.get(API.GET_USER_INFO, {
			defaultHandleError: true,
			rejectError: true
		});
	}

	getCustomerCall() {
		return this.httpService.get(API.GET_CUSTOMER_CALL);
	}
}
