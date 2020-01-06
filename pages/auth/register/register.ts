import { Component, Injectable } from '@angular/core';
import { App, AlertController, Platform, NavController } from 'ionic-angular';
import { ProtocolPage } from '../../user-center/enterprise/protocol/protocol';
import { RegisterService } from './register.service';
import { AuthService } from '../../../services/auth.service';
import { StatusBar } from '@ionic-native/status-bar';
import { Storage } from '@ionic/storage';
import { STORAGE_CONSTANT } from '../../../config/storage';

@Component({
	selector: 'page-register',
	templateUrl: 'register.html'
})

@Injectable()
export class RegisterPage {

	private SECOND = 60;
	private timer;
	params: any = {
		sendCodeText: '获取验证码',
		enableSendCode: false,
		requesting: false,
		showTips: false
	}

	registerParams: any = {
		userName: '',
		mobile: '',
		password: '',
		smsCode: ''
	}

	constructor(private app: App, private alertCtrl: AlertController, private registerService: RegisterService, private statusBar: StatusBar, private platForm: Platform, private authService: AuthService, private storage: Storage, private navCtrl: NavController) {

	}

	// 获取验证码
	getSmsCode () {
		this.registerValidate() ? this.sendMessageConfirm() : this.checkMobileAlert();
	}

	// 验证手机号
	registerValidate () {
		return (/^[1][3,4,5,7,8][0-9]{9}$/).test(this.registerParams.mobile);
	}

	// 确认是否发送验证码
	sendMessageConfirm () {
		let alert = this.alertCtrl.create({
			title: '确认手机号码',
			message: '我们将发送验证码短信到这个号码：' + this.registerParams.mobile,
			buttons: [
				{
					text: '取消',
					role: 'cancel',
				},
				{
					text: '好',
					handler: () => {
						// 发送验证码
						this.registerService.sendRegisterCode({
							mobile: this.registerParams.mobile
						}).then(res => {
							if (res) {
								// 倒计时
								let second = this.SECOND;
								this.params.enableSendCode = true;
								this.timer = setInterval(() => {
									second--;
									this.params.sendCodeText = `${second}秒后重新发送`;
									if (second == 0) {
										clearInterval(this.timer);
										this.params.sendCodeText = '获取验证码';
										this.params.enableSendCode = false;
									};
								}, 1000)
							}
						})
					}
				}
			]
		});
		alert.present();
	}

	// 手机号错误提示
	checkMobileAlert () {
		this.alertCtrl.create({
			title: '手机号码错误',
			subTitle: '您输入的是一个无效的手机号码',
			buttons: ['确定']
		}).present();
	}

	// 注册
	register () {
		this.params.requesting = true;
		this.registerService.memberRegister(this.registerParams).then(res => {
			// this.alertCtrl.create({
			// 	title: '提示',
			// 	subTitle: '恭喜您，注册成功！',
			// 	buttons: [
			// 		{
			// 			text: '立即体验',
			// 			handler: () => {
			// 				this.loginByPassword();
			// 			}
			// 		}
			// 	]
			// }).present();
			this.loginByPassword();
		}).catch(err => {
			this.params.requesting = false;
		})
	}

	loginByPassword () {
		this.params.requesting = true;
		this.authService.loginByPassword({
			account: this.registerParams.mobile,
			password: this.registerParams.password
		}).then(data => {
			this.loginSuccess();
		}, err => {
			this.params.requesting = false;
		})
	}

	// 登录成功后页面跳转
	loginSuccess () {
		this.storage.set(STORAGE_CONSTANT.USER_MOBILE, this.registerParams.mobile);
		this.app.getRootNav().setRoot(ProtocolPage);
	}


	ionViewWillEnter () {
		this.statusBar.styleLightContent();
	}

	ionViewWillLeave () {
		if (this.platForm.is('ios')) this.statusBar.styleDefault();
	}

	ionViewDidLoad () {
		document.getElementById("footer-register").style.top = document.body.clientHeight - 52 + 'px';
	}

	goLogin () {
		this.navCtrl.pop()
	}
}