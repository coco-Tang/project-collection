import { ENV as SERVER_CONFIG } from '@app/env';
import { Component } from '@angular/core';

import { AppVersion } from '@ionic-native/app-version';

@Component({
	selector: 'page-about',
	templateUrl: 'about.html'
})

export class AboutPage {
	currVersion: string;
	serverConfig: object = SERVER_CONFIG;
	constructor(private appVersion: AppVersion) {

		this.appVersion.getVersionNumber().then((version: string) => {
			this.currVersion = version;
		}).catch(error => {
			this.currVersion = "未获取到版本号";
		})

	}
}