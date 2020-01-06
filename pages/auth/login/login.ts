import { Component, Injectable } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { AlertController, App, NavController, Platform } from 'ionic-angular';
import { TabsPage } from '../../tabs/tabs';
import { Storage } from '@ionic/storage';
import { STORAGE_CONSTANT } from '../../../config/storage';
import { StatusBar } from '@ionic-native/status-bar';
import { RegisterPage } from '../register/register';
import { ProtocolPage } from '../../user-center/enterprise/protocol/protocol';

@Component({
	selector: 'page-login',
	templateUrl: 'login.html'
})

@Injectable()
export class LoginPage {

	private loginType: boolean = false;
	private SECOND = 60;
	private timer;
	registerPage: any;

	loginParams: any = {
		account: '',
		password: '',
		smsCode: ''
	}

	params: any = {
		sendCodeText: '获取验证码',
		enableSendCode: false,
		requesting: false
	}

	constructor(private authService: AuthService, private alertCtrl: AlertController, public navCtrl: NavController, private storage: Storage, private app: App, private statusBar: StatusBar, private platForm: Platform) {
		this.registerPage = RegisterPage;
		this.storage.get(STORAGE_CONSTANT.USER_MOBILE).then(res => {
			this.loginParams.account = res;
		})
	}

	toggleLoginType () {
		this.loginType = !this.loginType;
		this.loginParams.password = '';
		this.loginParams.smsCode = '';
	}

	// 登录
	login () {
		if (!this.mobileValidate()) {
			this.checkMobileAlert();
			return;
		}
		this.params.requesting = true;
		if (this.loginParams.password) {
			this.loginByPassword()
		} else if (this.loginParams.smsCode) {
			this.loginBySmsCode()
		}
	}

	loginByPassword () {
		this.authService.loginByPassword(this.loginParams).then(data => {
			this.loginSuccess();
		}, err => {
			this.params.requesting = false;
		})
	}

	loginBySmsCode () {
		this.authService.loginBySmsCode(this.loginParams).then(data => {
			this.loginSuccess();
		}, err => {
			this.params.requesting = false;
		})
	}

	// 登录成功后页面跳转
	loginSuccess () {
		this.storage.set(STORAGE_CONSTANT.USER_MOBILE, this.loginParams.account);
		this.authService.getAccountInfo().then(res => {
			if (res.enterpriseCount || res.auditCount) {
				this.app.getRootNav().setRoot(TabsPage);
			} else {
				// 去创建企业
				this.app.getRootNav().setRoot(ProtocolPage);
			}
		})
	}


	// 获取验证码
	getSmsCode () {
		this.mobileValidate() ? this.sendMessageConfirm() : this.checkMobileAlert();
	}

	// 验证手机号
	mobileValidate () {
		return (/^[1][3,4,5,7,8][0-9]{9}$/).test(this.loginParams.account);
	}

	// 手机号错误提示
	checkMobileAlert () {
		let alert = this.alertCtrl.create({
			title: '手机号码错误',
			subTitle: '您输入的是一个无效的手机号码',
			buttons: ['确定']
		});
		alert.present();
	}

	// 确认是否发送验证码
	sendMessageConfirm () {
		let alert = this.alertCtrl.create({
			title: '确认手机号码',
			message: '我们将发送验证码短信到这个号码：' + this.loginParams.account,
			buttons: [
				{
					text: '取消',
					role: 'cancel',
				},
				{
					text: '好',
					handler: () => {
						// 发送验证码
						this.authService.sendSmsCode(this.loginParams).then(res => {
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

	ionViewWillEnter () {
		if (this.platForm.is('ios')) this.statusBar.styleDefault();
	}

	ionViewDidLoad () {
		document.getElementById("footer-login").style.top = document.body.clientHeight - 52 + 'px';
	}

}