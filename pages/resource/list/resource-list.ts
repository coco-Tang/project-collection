import { Component, ViewChild } from '@angular/core';
import { NavController, Refresher, InfiniteScroll, NavParams } from 'ionic-angular';
import { ResourceService } from '../resource.service';
import { ResourceDetailPage } from '../resource-detail/resource-detail';
import { Helper } from '../../../utils/helper';

@Component({
	selector: 'page-resource-list',
	templateUrl: 'resource-list.html'
})

export class ResourceListPage {
	@ViewChild(Refresher) refresher: Refresher;
	@ViewChild(InfiniteScroll) infiniteScroll: InfiniteScroll;

	detailPage: any;
	resourceList: any = [];
	pageTitle: string;
	isLoading: boolean = true;
	totalPage: number;
	transactionType: any = this.resourceService.TRANSACTION_TYPE_ENUM;
	pageParams: any = {
		goodsCateId: '',
		listCount: 0,
		page: {
			pageNo: 1,
			pageSize: 10,
		}
	}


	constructor(public navCtrl: NavController, public navParams: NavParams, private resourceService: ResourceService, private helper: Helper) {
		this.detailPage = ResourceDetailPage;
		this.pageParams.goodsCateId = this.navParams.get('goodsCateId');
		this.pageTitle = this.navParams.get('goodsCateName');
		this.loadResourceList();
	}

	loadResourceList () {
		return new Promise((resolve, reject) => {
			this.resourceService.getResourceList(this.pageParams).then(res => {
				this.isLoading = false;
				this.resourceList = this.resourceList.concat(res.goodsCates[0].goodsResults);
				this.totalPage = Math.ceil(res.totalCount / this.pageParams.page.pageSize);
				resolve(res);
			}).catch(err => this.isLoading = false);
		})
	}

	// 下拉刷新
	doRefresh () {
		this.pageParams.page.pageNo = 1;
		this.resourceList = [];
		this.loadResourceList().then(res => {
			this.refresher.complete();
		})
	}

	doPull (event) {
		this.helper.elasticRefresh(event);
	}

	// 上拉加载翻页
	doInfinite () {
		this.pageParams.page.pageNo += 1;
		if (this.pageParams.page.pageNo > this.totalPage) {
			this.infiniteScroll.complete();
			return;
		}
		this.loadResourceList().then(res => {
			this.infiniteScroll.complete();
		})
	}
}