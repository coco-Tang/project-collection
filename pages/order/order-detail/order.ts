import { Component } from '@angular/core';
import { Platform, NavParams } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { OrderService } from '../order.service';
import { ResourceDetailPage } from '../../resource/resource-detail/resource-detail';

@Component({
  selector: 'page-order',
  templateUrl: 'order.html'
})
export class OrderPage {
  resourceDetailPage: any;
  navData: any;
  orderDetail: any;

  isLoading: boolean = true;
  submitText: string = "请前往PC端进行后续操作";
  payTypes: any = this.orderService.PAYMENT_TYPE;
  orderStatus: any = this.orderService.ORDER_STATUS;
  deliveryMethodTypes: any = this.orderService.DELIVERY_MODE;

  isMention: boolean = false; //是否自提
  constructor(navParams: NavParams, private orderService: OrderService, public statusBar: StatusBar, public platForm: Platform) {
    this.resourceDetailPage = ResourceDetailPage;
    this.navData = navParams.data;
    this.getOrderInfo();
  }

  getOrderInfo () {
    this.isLoading = true;
    this.orderService.getOrderDetail({ orderId: this.navData.orderId }).then(res => {
      this.orderDetail = this.dealOrderInfo(res);
      this.orderDetail = res;
      this.isLoading = false;
    }).catch(err => {
      this.isLoading = false
    })
  }

  dealOrderInfo (data) {
    this.isMention = (data.deliveryType == 'S')
    this.orderStatus.map(obj => {
      if (data.orderStatus == obj.id) {
        data.orderStatus = obj.value;
      }
    })
    this.deliveryMethodTypes.map(obj => {
      if (data.deliveryType == obj.id) {
        data.deliveryType = obj.value;
      }
    })

    this.payTypes.map(obj => {
      if (data.payMode == obj.id) {
        data.payMode = obj.value
      }
    })
    return data;
  }
  ionViewWillEnter () {
    if (this.platForm.is('ios')) this.statusBar.styleDefault();
  }

  ionViewWillLeave () {
    this.statusBar.styleLightContent();
  }
}
