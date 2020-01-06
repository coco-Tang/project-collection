import { Component, ViewChild } from '@angular/core';
import { Tabs, NavParams, App } from "ionic-angular";
import { UserCenterPage } from '../user-center/user-center';
import { HomePage } from '../home/home';
import { NoticePage } from '../notice/notice';
import { PartnerPage } from '../partner/partner';
import { LoginPage } from '../auth/login/login';
import { FollowPage } from '../follow/follow';
import { StatusBar } from '@ionic-native/status-bar';

import { Storage } from '@ionic/storage';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html'
})
export class TabsPage {
  @ViewChild('mainTabs') tabs: Tabs;
  tab1Root = HomePage;
  tab2Root = PartnerPage;
  tab3Root = NoticePage;
  tab4Root = UserCenterPage;
  funTabsSelectedIndex: any;
  constructor(public app: App, private statusBar: StatusBar, private navParams: NavParams, public storage: Storage, public authService: AuthService) {
    this.funTabsSelectedIndex = this.navParams.data.tabIndex || 0;
  }

  ionViewWillEnter () {
    this.statusBar.styleLightContent();
  }
  ionViewDidLoad () {
    this.getCurrentPage();
  }

  getCurrentPage () {
    this.authService.getAccountInfo().then(res => {
      if (!res.attentionCount) this.app.getRootNav().setRoot(FollowPage);
    }, err => {
      this.app.getRootNav().setRoot(LoginPage);
    })
  }
}
