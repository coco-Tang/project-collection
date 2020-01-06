import { Component, Injectable, ViewChild } from '@angular/core';
import { FollowService } from './follow.service';
import { AuthService } from '../../services/auth.service';
import { InfiniteScroll, Refresher, App, Platform, NavController } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';
import { StatusBar } from '@ionic-native/status-bar';

@Component({
	selector: 'page-follow',
	templateUrl: 'follow.html'
})

@Injectable()
export class FollowPage {
	@ViewChild(InfiniteScroll) infiniteScroll: InfiniteScroll;
	@ViewChild(Refresher) refresher: Refresher;

	params: any = {
		pageNo: 1,
		pageSize: 20
	}

	categoryParams: any = {
		list: [],
		totalPage: '',
	}

	isLoading: boolean = true;
	followCount: number = 0;

	followState: any = this.followService.FOLLOW_STATE;
	disableBtn: boolean = false;
	constructor(public authService: AuthService, public navCtrl: NavController, private followService: FollowService, private statusBar: StatusBar, private app: App, private platForm: Platform) {
		this.init();
		this.getAttentionCount();
	}

	init () {
		return new Promise((resolve, reject) => {
			this.followService.getFollowList(this.params).then(res => {
				this.isLoading = false;
				if (res) {
					this.categoryParams.list = this.categoryParams.list.concat(res.rows);
					this.categoryParams.totalPage = res.lastPage;
				}
				resolve(res);
			}).catch(err => {
				this.isLoading = false;
				reject(err);
			})
		})
	}

	// 点击关注
	toggleFollow (attentionId, goodsCateId, isAttention, index) {
		let status;
		if (isAttention === this.followState.followed) {
			status = this.followState.follow;
			this.categoryParams.list[index].isAttention = this.followState.follow;
		} else {
			status = this.followState.followed;
			this.categoryParams.list[index].isAttention = this.followState.followed;
		}
		this.followService.followUpdate({
			attentionId,
			goodsCateId,
			status
		}).then(res => {
			this.getAttentionCount();
		})
	}

	getAttentionCount () {
		this.authService.getAccountInfo().then(res => {
			if (!res.attentionCount) {
				this.disableBtn = true
			} else {
				this.disableBtn = false;
			}
		}).catch(err => { })
	}

	// 确认关注，跳转到首页
	confirmFollow () {
		this.app.getRootNav().setRoot(TabsPage);
	}

	// 加载更多
	doInfinite () {
		this.params.pageNo += 1;
		if (this.params.pageNo > this.categoryParams.totalPage) {
			this.infiniteScroll.complete();
			return;
		}
		this.init().then(res => {
			this.infiniteScroll.complete();
		})
	}

	ionViewWillEnter () {
		if (this.platForm.is('ios')) this.statusBar.styleDefault();
	}

}