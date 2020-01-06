import { Injectable } from '@angular/core';
import { API } from '../../config/api';
import { HttpService } from '../../services/http.service';

@Injectable()
export class NoticeService {
	constructor(private httpService: HttpService) {

	}

	//消息列表
	getNoticeList (params?) {
		return this.httpService.post(API.GET_NOTICE_LIST, params, {
			defaultHandleError: true,
			rejectError: false
		});

	}

}