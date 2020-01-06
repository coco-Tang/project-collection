import { Component } from '@angular/core';
import { NavParams, ViewController, ToastController } from 'ionic-angular';

@Component({
	selector: 'page-enquiry-adjust',
	templateUrl: 'enquiry-adjust.html'
})

export class EnquiryAdjustPage {
	params: any = {
		price: '',
		quantity: '',
		toPage: '',
		uom: ''
	};

	renderInfo: any = {
		title: '',
		tips: ''
	}

	toPage: any = {
		price: 1,
		quantity: 2
	}

	constructor(private navParams: NavParams, private viewCtrl: ViewController, private toastCtrl: ToastController) {
		this.params.price = this.navParams.get('price');
		this.params.quantity = this.navParams.get('quantity');
		this.params.toPage = this.navParams.get('toPage');
		// this.params.enquiryId = this.navParams.get('enquiryId');
		// this.params.followerEntId = this.navParams.get('enterpriseId');
		this.params.uom = this.navParams.get('uom');



		if (this.params.toPage == this.toPage.price) {
			this.renderInfo.title = '单价';
			this.renderInfo.tips = `请输入商品单价（货币：¥）`
		} else if (this.params.toPage == this.toPage.quantity) {
			this.renderInfo.title = '销售数量';
			this.renderInfo.tips = `请输入销售数量（单位：${this.params.uom}）`
		}

	}

	confirm () {
		let priceRegExp = /^(?:0\.\d{1,2}|(?!0)\d+(?:\.\d{1,2})?)$/;
		let countRegExp = /^(?:0\.\d{1,2}|(?!0)\d+(?:\.\d{1,3})?)$/;
		if (this.params.toPage == this.toPage.price && (!priceRegExp.test(this.params.price) || (this.params.price + '').length > 9)) {
			this.showToast('请输入正确的价格(最多2位小数)');
			return;
		} else if (this.params.toPage == this.toPage.quantity && (!countRegExp.test(this.params.quantity) || (this.params.quantity + '').length > 8)) {
			this.showToast('请输入正确的数量(最多3位小数)');
			return;
		}
		this.viewCtrl.dismiss(this.params);
	}

	showToast (value) {
		this.toastCtrl.create({
			message: value,
			duration: 2000,
			position: 'middle',
			dismissOnPageChange: true
		}).present();
	}

	close () {
		this.viewCtrl.dismiss({ closeModal: true });
	}

}