import { Component } from '@angular/core';
import { OrderPage } from '../order-detail/order';
import { OrderService } from '../order.service';
import moment from 'moment';
import { Helper } from '../../../utils/helper';
@Component({
	selector: "page-order-list",
	templateUrl: "order-list.html"
})
export class OrderListPage {
	loadDone: boolean = false;
	orderList: any = [];
	orderPush: any = OrderPage;
	isInfinite: boolean = false;
	pageParams: any = {
		pageNo: 1,
		pageSize: 10,
		totalCount: ""
	};
	constructor(public orderService: OrderService, private helper: Helper) {
		this.getOrderList(false);
	}

	getOrderList ($event) {
		this.loadDone = false;
		return new Promise((resolve, reject) => {
			this.orderService.getOrderList(this.pageParams).then(res => {
				this.loadDone = true;
				res.rows = this.dealData(res.rows);
				if (this.isInfinite) {
					resolve(res.rows);
					return;
				}
				this.orderList = res.rows;
				this.pageParams.totalCount = res.recordCount;
				resolve();
			}).catch(err => {
				this.loadDone = true;
				$event && $event.complete();
				if (this.isInfinite) this.isInfinite = false;
			})
		})
	}

	doRefresh ($event) {
		this.pageParams.pageNo = 1;
		this.getOrderList($event).then(() => {
			$event.complete();
		})
	}

	doPull (event) {
		this.helper.elasticRefresh(event);
	}

	doInfinite ($event) {
		if (this.pageParams.pageSize * this.pageParams.pageNo < this.pageParams.totalCount) {
			this.pageParams.pageNo += 1;
			this.isInfinite = true;
			this.getOrderList($event).then((orderList: Array<object>) => {
				this.orderList = [...this.orderList, ...orderList];
				this.isInfinite = false;
				$event.complete();
			})
		} else {
			$event.complete();
		}
	}

	dealData (data) {
		data.map(order => {
			order.createTime = order.createTime ? moment(order.createTime).format('MM/DD') : '';
			this.orderService.ORDER_STATUS.map(obj => {
				if (order.orderStatus == obj.id) {
					order.orderStatus = obj.value;
				}
			})
		})
		return data;
	}
}