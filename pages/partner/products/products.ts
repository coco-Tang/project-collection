import { Component } from '@angular/core';
import { NavParams } from 'ionic-angular';
import { CategoryService } from '../../category/category.service';
import { ResourceService } from '../../resource/resource.service';
import { ResourceDetailPage } from '../../resource/resource-detail/resource-detail';
import moment from 'moment';
import { Helper } from '../../../utils/helper';

@Component({
	selector: 'page-products',
	templateUrl: 'products.html'
})

export class StoreProdutsPage {
	productsArr: any = [];
	enterpriseName: any = "";
	enterpriseId: any = "";
	isInfinite: boolean = false;
	loadDone: boolean = false;
	pageParams: any = {
		pageNo: 1,
		pageSize: 10,
		totalCount: ""
	}
	TRANSACTION_TYPE_ENUM: any;
	resourceDetailPush: any = ResourceDetailPage;

	constructor(public resourceService: ResourceService, public navParams: NavParams, public categoryService: CategoryService, private helper: Helper) {
		this.enterpriseName = this.navParams.get("enterpriseName");
		this.enterpriseId = this.navParams.get("enterpriseId");
		this.getProducts(false);
		this.TRANSACTION_TYPE_ENUM = resourceService.TRANSACTION_TYPE_ENUM;
	}

	getProducts ($event) {
		this.loadDone = false;
		return new Promise((resolve, reject) => {
			let params = {
				enterpriseId: this.enterpriseId,
				page: this.pageParams
			}
			this.categoryService.getGoodsCategoryTree(params).then(res => {
				this.loadDone = true;
				res.goodsResults = this.dealData(res.goodsResults);
				if (this.isInfinite) {
					resolve(res.goodsResults || []);
					return;
				};
				this.productsArr = res.goodsResults || [];
				this.pageParams.totalCount = res.totalCount;
				resolve();
			}).catch(err => {
				this.loadDone = true;
				$event && $event.complete();
				if (this.isInfinite) this.isInfinite = false;
			})
		})
	}

	doInfinite (infiniteScroll) {
		if (this.pageParams.pageSize * this.pageParams.pageNo < this.pageParams.totalCount) {
			this.pageParams.pageNo += 1;
			this.isInfinite = true;
			this.getProducts(infiniteScroll).then((goods: Array<object>) => {
				this.productsArr = [...this.productsArr, ...goods];
				this.isInfinite = false;
				infiniteScroll.complete();
			})
		} else {
			infiniteScroll.complete();
		}
	}

	doRefresh (refresher?) {
		this.pageParams.pageNo = 1;
		this.getProducts(refresher).then(() => {
			if (refresher) refresher.complete();
		})
	}

	doPull (event) {
		this.helper.elasticRefresh(event);
	}

	dealData (data) {
		data.map(item => {
			let stamp = new Date(item.effectTime.replace(/-/g, '/')).getTime();
			let end_minutes = moment(stamp).diff(moment(), 'minutes');
			if (end_minutes > 0) {
				item.effectTime = Number.parseInt(end_minutes / 60 + '') + "时" + (end_minutes % 60) + "分";
			} else {
				item.effectTime = 0;
			}
			this.TRANSACTION_TYPE_ENUM.map(obj => {
				if (item.transactionType == obj.id) {
					item.transactionType = obj.value;
				}
			})
		})
		return data;
	}
}