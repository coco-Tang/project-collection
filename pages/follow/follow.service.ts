import { Injectable } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { API } from '../../config/api';

@Injectable()
export class FollowService {

	constructor(private httpService: HttpService) {

	}

	// 关注状态枚举
	FOLLOW_STATE: any = {
		follow: '0', // 关注
		followed: '1', // 已关注
		followDisabled: '2' // 已关注（不可修改）
	}

	// 获取关注列表
	getFollowList (params) {
		return this.httpService.post(API.FOLLOW_GET_LIST, params)
	}

	// 点击关注
	followUpdate (params) {
		return this.httpService.post(API.FOLLOW_UPDATE, params, {
			defaultHandleError: true,
			rejectError: false
		})
	}

}