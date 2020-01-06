import { Component } from '@angular/core';
import { EnterpriseFormPage } from '../enterprise-form/enterprise-form';
import { EnterpriseService } from '../enterprise.service';
import { NavController, NavParams } from 'ionic-angular';
import { TabsPage } from '../../../tabs/tabs';
import { StatusBar } from '@ionic-native/status-bar';
@Component({
  selector: 'page-protocol',
  templateUrl: 'protocol.html'
})

export class ProtocolPage {
  templateHTML: any;
  contents: string;
  loadDone: boolean;
  constructor(public statusBar: StatusBar, public navParams: NavParams, public enterpriseService: EnterpriseService, public navCtrl: NavController) {
    this.getHtml();
  }

  ionViewWillEnter () {
    this.statusBar.styleLightContent();
  }

  getHtml () {
    this.loadDone = false;
    this.enterpriseService.getProtocol(this.enterpriseService.PROTOCOL.checkIn).then(res => {
      this.contents = res.contents;
      this.loadDone = true;
    }).catch(err => { })
  }

  ignoreCreate () {
    this.navCtrl.setRoot(TabsPage);
  }

  goEnterprise () {
    if (this.navParams.data['sourcePage'] === 'enterpriseList') {
      this.navCtrl.push(EnterpriseFormPage, {
      }, {
          direction: 'forward'
        }).then(() => {
          const index = this.navCtrl.getActive().index;
          this.navCtrl.remove(index - 1);
        })
    } else {
      this.navCtrl.push(EnterpriseFormPage);
    }
  }
}