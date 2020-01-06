import { Component, ViewChild } from '@angular/core';
import { NavController, Refresher } from 'ionic-angular';

import { ProfilePage } from './profile/profile';
import { SettingsPage } from './settings/settings';
import { OrderListPage } from '../order/order-list/order-list';

import { UserService } from '../user-center/user.service';
import { Helper } from '../../utils/helper';
@Component({
  selector: 'page-user-center',
  templateUrl: 'user-center.html'
})
export class UserCenterPage {
  @ViewChild(Refresher) refresher: Refresher;
  userInfo: any;
  companyShow: boolean;
  fullName: string;
  customerCall: string;
  SettingsPage: any;
  orderListPush: any = OrderListPage;
  isLoading: boolean = true;
  requestFailure: boolean;

  constructor(public navCtrl: NavController, private userService: UserService, private helper: Helper) {
    this.SettingsPage = SettingsPage;

  }

  doRefresh () {
    this.userService.getUserInfo().then(res => {
      this.userInfo = res;
      this.refresher.complete();
    }).catch(error => {
      this.refresher.complete();
      this.requestFailure = true;
    })
  }

  doPull (event) {
    this.helper.elasticRefresh(event);
  }

  goMyInfo () {
    this.navCtrl.push(ProfilePage)
  }

  ionViewWillEnter () {
    this.userService.getUserInfo().then(res => {
      this.isLoading = false;
      this.requestFailure = false;
      this.userInfo = res;
    }).catch(error => {
      this.isLoading = false;
      this.requestFailure = true;
    })

    this.userService.getCustomerCall().then(customerCall => {
      this.customerCall = customerCall;
    })
  }
}
