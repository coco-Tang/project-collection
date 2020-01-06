import { Component, ViewChild } from '@angular/core';
import { InfiniteScroll, Refresher } from 'ionic-angular';
import { NoticeService } from '../notice/notice.service';
import { ChatPage } from '../enquiry/chat/chat';
import { StatusBar } from '@ionic-native/status-bar';
import { Helper } from '../../utils/helper';

@Component({
	selector: 'page-notice',
	templateUrl: 'notice.html'
})
export class NoticePage {
	@ViewChild(InfiniteScroll) infiniteScroll: InfiniteScroll;
	@ViewChild(Refresher) refresher: Refresher;
	noticeList: any = {
		list: [],
		totalPage: ''
	};
	isLoading: boolean = true;
	params: any = {
		pageNo: 1,
		pageSize: 20
	};
	chatPage: any;
	refreshing: boolean = false;

	constructor(private noticeService: NoticeService, private statusBar: StatusBar, private helper: Helper) {
		this.chatPage = ChatPage;
	}
	loadNoticeList () {
		this.isLoading = true;
		return this.noticeService.getNoticeList(this.params).then(res => {
			this.isLoading = false;
			if (this.refreshing) {
				this.noticeList.list = [];
			}
			this.noticeList.list = this.noticeList.list.concat(res.rows) || [];
			this.noticeList.totalPage = Math.ceil(res.recordCount / this.params.pageSize);
		}).catch(err => {
			this.isLoading = false;
		})

	}


	// 每次进入页面都更新数据
	ionViewWillEnter () {
		this.params.pageNo = 1;
		this.noticeList.list = [];
		this.statusBar.styleLightContent();
		this.loadNoticeList();
	}
	// 刷新页面
	doRefresh () {
		this.refreshing = true;
		this.params.pageNo = 1;
		this.loadNoticeList().then(res => {
			this.refreshing = false;
			this.refresher.complete();
		})
	}

	doPull (event) {
		this.helper.elasticRefresh(event);
	}

	// 加载更多
	doInfinite () {
		this.params.pageNo += 1;
		if (this.params.pageNo > this.noticeList.totalPage) {
			this.infiniteScroll.complete();
			return;
		}
		this.loadNoticeList().then(res => {
			this.infiniteScroll.complete();
		})
	}


}
