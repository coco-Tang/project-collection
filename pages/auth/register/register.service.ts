import { Injectable } from '@angular/core';
import { API } from '../../../config/api';
import { HttpService } from '../../../services/http.service';
import { Helper } from '../../../utils/helper';

@Injectable()
export class RegisterService {

	constructor(private httpService: HttpService, private helper: Helper) {

	}

	// 发送注册手机验证码
	sendRegisterCode(params) {
		return this.httpService.get(this.helper.URL.getUrl(API.SEND_REGISTER_CODE, params), {
			defaultHandleError: true,
			rejectError: false
		})
	}

	// 注册
	memberRegister(params) {
		return this.httpService.post(API.MEMBER_REGISTER, params);
	}
}