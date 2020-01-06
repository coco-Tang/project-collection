import { Component } from '@angular/core';
import { StoreProdutsPage } from './products/products'
import { EnterpriseService } from '../user-center/enterprise/enterprise.service'
import { Helper } from '../../utils/helper'

@Component({
	selector: 'page-partner',
	templateUrl: 'partner.html'
})

export class PartnerPage {
	loadDone: boolean = false;
	isInfinite: boolean = false;
	partnerArr: any = [];
	storeProdutsPush: any = StoreProdutsPage;
	pageParams: any = {
		pageNo: 1,
		pageSize: 15,
		totalCount: ''
	}
	constructor(public enterpriseService: EnterpriseService, private helper: Helper) {
		this.getPartnerList(false);
	}

	getPartnerList ($event) {
		this.loadDone = false;
		return new Promise((resolve, reject) => {
			this.enterpriseService.getPartnerList(this.pageParams).then(res => {
				this.loadDone = true;
				if (this.isInfinite) {
					resolve(res.rows || []);
					return;
				}
				this.partnerArr = res.rows || [];
				this.pageParams.totalCount = res.recordCount;
				resolve();
			}).catch(err => {
				this.loadDone = true;
				$event && $event.complete()
				if (this.isInfinite) this.isInfinite = false;
			})
		})

	}

	doRefresh ($event) {
		this.pageParams.pageNo = 1;
		this.getPartnerList($event).then(() => {
			if ($event) $event.complete();
		})
	}

	doPull (event) {
		this.helper.elasticRefresh(event);
	}

	doInfinite ($event) {
		if (this.pageParams.pageSize * this.pageParams.pageNo < this.pageParams.totalCount) {
			this.isInfinite = true;
			this.pageParams.pageNo += 1;
			this.getPartnerList($event).then((data: Array<object>) => {
				this.partnerArr = [...this.partnerArr, ...data];
				this.isInfinite = false;
				$event.complete();
			})
		} else {
			$event.complete();
		}
	}
}