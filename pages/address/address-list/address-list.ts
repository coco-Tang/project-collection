import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, Refresher, App } from 'ionic-angular';
import { EnquiryPage } from '../../enquiry/enquiry'
import { TabsPage } from '../../tabs/tabs'

import { AddressService } from '../address.service';

@Component({
  selector: 'page-address-list',
  templateUrl: 'address-list.html'
})
export class AddressListPage {
  @ViewChild(Refresher) refresher: Refresher;

  EnquiryPage: any;
  TabsPage: any;
  navData: any;
  loadDateDown: boolean;
  noAddress: boolean = false;
  addressList: any;
  checkedAddress: any;

  constructor(public navCtrl: NavController, navParams: NavParams, private addressService: AddressService, private app: App) {
    this.TabsPage = TabsPage;
    this.navData = navParams.data;
    this.addressService.getAddress(this.navData.enquiryParams.enterpriseId).then(res => {
      this.loadDateDown = true;
      this.addressList = res;
    }).catch(error => {
      this.loadDateDown = true;
    });
  }

  gotoEnquiryPage (item) {
    this.checkedAddress = item;
    this.navData.step = 5;
    this.navData.checkedAddress = item;
    this.navCtrl.push(EnquiryPage, this.navData);
  }

  goTabs () {
    this.app.getRootNav().setRoot(TabsPage);
  }
}
