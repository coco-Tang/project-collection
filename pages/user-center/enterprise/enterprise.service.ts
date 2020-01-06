import { Injectable } from '@angular/core';
import { API } from '../../../config/api';

import { HttpService } from '../../../services/http.service'

@Injectable()
export class EnterpriseService {
	constructor(private httpService: HttpService) {

	}

	//企业类型
	ENTERPRISE_TYPE = [
		{
			id: 'FACTORY',
			value: '工厂'
		}, {
			id: 'MERCHANT',
			value: '贸易商'
		}, {
			id: 'OTHER',
			value: '工贸一体'
		}];

	//企业状态
	ENTERPRISE_STATUS = [
		{
			id: "EDIT",
			value: '未完成'
		}, {
			id: 'WAIT',
			value: '待审核'
		}, {
			id: 'UNPASS',
			value: '审核不通过'
		}, {
			id: 'PASS',
			value: '审核通过'
		}];

	//协议
	PROTOCOL = {
		'checkIn': 'PROTOCOL_MOBILE_ENTERPRISE_ENTRY'
	}

	//上传文件类型
	FILE_TYPE = {
		entLogo: ' ENT_LOGO',//企业头像
		entQua: 'ENT_QUA',//企业资质  
		entLic: 'ENT_LIC',//企业执照  
		entTax: 'ENT_TAX',// 企业税务  
		entOrg: 'ENT_ORG',//企业组织机构 
		userLogo: 'USER_LOGO',//用户头像  
		contact: 'CONTRACT',//合同 
		admin: 'ENT_ADMIN_AUTHORIZATION'//授权委托书
	}

	//获取合作企业
	getPartnerList (params) {
		return this.httpService.post(API.GET_PARTNER_LIST, params);
	}

	//拥有企业列表
	getEnterpriseList () {
		return this.httpService.get(API.GET_ENTERPRISE_LIST);
	}

	//获取协议
	getProtocol (param) {
		return this.httpService.get(API.GET_CHECK_IN_PROTOCOL + "?fileType=" + param);
	}

	//获取企业信息
	getEnterpriseInfo (param) {
		return this.httpService.get(API.GET_ENTERPRISE_INFO + "?enterpriseId=" + param);
	}

	//注册/修改企业信息
	postEnterpriseInfo (params) {
		return this.httpService.post(API.CREATE_ENTERPRISE, params, {
			defaultHandleError: true,
			rejectError: true
		});
	}
}