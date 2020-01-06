import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { EnterpriseListPage } from '../enterprise/enterprise-list'
import { UserService } from '../../user-center/user.service';
@Component({
	selector: 'page-profile',
	templateUrl: 'profile.html'
})

export class ProfilePage {
	userInfo: any;
	buttonColor: string;

	constructor(public userService: UserService, public navCtrl: NavController) {
		this.getUserInfo();
	}

	getUserInfo () {
		this.userService.getUserInfo().then(res => {
			this.userInfo = res;
		}).catch(error => {
		})
	}
	getEnterpriseList () {
		this.navCtrl.push(EnterpriseListPage);
	}
}

