import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { TabsPage } from '../../pages/tabs/tabs'

@Component({
	selector: 'page-common-dialog',
	templateUrl: 'common-dialog.html'
})
export class CommonDialog {

	tabsPage: any;
	logo: string;
	title: string;
	message: string;

	constructor(public navCtrl: NavController, private navParams: NavParams, public viewCtrl: ViewController) {

		this.tabsPage = TabsPage;
		this.logo = this.navParams.get("logo");
		this.message = this.navParams.get("message");
	}

	// 确定
	confirm () {
		this.viewCtrl.dismiss();
	}
}
