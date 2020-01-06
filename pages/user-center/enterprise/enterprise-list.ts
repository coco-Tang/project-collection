import { Component, ViewChild } from '@angular/core';
import { NavController, Navbar, App } from 'ionic-angular';
import { ProtocolPage } from './protocol/protocol';
import { EnterpriseFormPage } from './enterprise-form/enterprise-form';
import { StatusBar } from '@ionic-native/status-bar';

import { EnterpriseService } from './enterprise.service';
import { Helper } from '../../../utils/helper';
@Component({
  selector: 'page-enterprise-list',
  templateUrl: 'enterprise-list.html'
})
export class EnterpriseListPage {
  items: any;
  protocolPush: any = ProtocolPage;
  loadDone: boolean = true;
  @ViewChild(Navbar) navBar: Navbar;
  constructor(public statusBar: StatusBar, public app: App, public enterpriseService: EnterpriseService, public navCtrl: NavController, private helper: Helper) {

  }
  ionViewWillEnter () {
    this.getEnterpriseList(false);
    this.statusBar.styleLightContent();
  }

  getEnterpriseList (refresher) {
    this.loadDone = false;
    this.enterpriseService.getEnterpriseList().then((res) => {
      this.items = this.dealData(res);
      this.loadDone = true;
      refresher ? refresher.complete() : '';
    }).catch(err => {
      this.loadDone = true;
      refresher ? refresher.complete() : '';
    })
  }

  dealData (data) {
    data.map(item => {
      item.status == 'UNPASS' ? item.operation = '重新申请' : item.status == 'EDIT' ? item.operation = '继续完成' : '';
      this.enterpriseService.ENTERPRISE_STATUS.map(obj => {
        if (item.status == obj.id) {
          item.statusStr = obj.value;
        }
      })
      item.status == 'PASS' ? item.statusStr = '' : '';
    })
    return data;
  }

  gotoCreateEnterprise (enterprise) {
    if (enterprise.status == 'UNPASS' || enterprise.status == 'EDIT') {
      this.navCtrl.push(EnterpriseFormPage, { enterpriseId: enterprise.enterpriseId });
    }
  }

  doRefresh (refresher?) {
    this.getEnterpriseList(refresher);
  }

  doPull (event) {
    this.helper.elasticRefresh(event);
  }

}
