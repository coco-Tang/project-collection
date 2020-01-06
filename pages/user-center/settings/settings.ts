import { Component } from '@angular/core';
import { Platform, NavController, NavParams, ActionSheetController, App } from 'ionic-angular';

import { LoginPage } from '../../auth/login/login';
import { AboutPage } from './about/about';

import { AuthService } from '../../../services/auth.service';

@Component({
	selector: 'page-settings',
	templateUrl: 'settings.html'
})

export class SettingsPage {
	currVersion: string;
	AboutPage: any;

	constructor(public navCtrl: NavController, public navParams: NavParams, public platform: Platform, private actionSheetCtrl: ActionSheetController, private authService: AuthService, private app: App) {
		this.AboutPage = AboutPage;
	}

	logoutAlert() {
		let actionSheet = this.actionSheetCtrl.create({
			title: '退出后不会删除任何历史数据，下次登录依然可以使用本账号。',
			cssClass: 'exit-dialog',
			buttons: [
				{
					text: '退出登录',
					role: 'destructive',
					handler: () => {
						this.authService.logout();
						// this.navCtrl.push(LoginPage);
						this.app.getRootNav().setRoot(LoginPage);
					}
				}, {
					text: '取消',
					role: 'cancel'
				}
			]
		});

		actionSheet.present();
	}
}

