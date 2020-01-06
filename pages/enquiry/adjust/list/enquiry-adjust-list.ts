import { Component } from '@angular/core';
import { Events, NavController, NavParams, ToastController, ModalController } from 'ionic-angular';
import { EnquiryAdjustPage } from '../enquiry-adjust';
import { EnquiryService } from '../../enquiry.service';

@Component({
	selector: 'page-enquiry-adjust-list',
	templateUrl: 'enquiry-adjust-list.html',
})


export class EnquiryAdjustListPage {

	title: any;
	adjustPage: any;
	params: any;
	requesting: boolean = false;
	toPage: any = {
		price: 1,
		quantity: 2
	}
	buyerOperation: any = this.enquiryService.BUYER_OPERATION;
	operationId: any = this.navParams.get('operationId');
	constructor(public events: Events, private navCtrl: NavController, private navParams: NavParams, private enquiryService: EnquiryService, public toastCtrl: ToastController, private modalCtrl: ModalController) {

		this.adjustPage = EnquiryAdjustPage;
		this.params = {
			price: this.navParams.get('price'),
			quantity: this.navParams.get('quantity'),
			uom: this.navParams.get('uom'),
			enquiryId: this.navParams.get('enquiryId'),
			deliveryFee: 0,
			comments: '',
			enterpriseId: this.navParams.get('followerEntId'),
		};
		this.title = this.operationId == this.buyerOperation.agree ? '同意下单' : this.operationId == this.buyerOperation.quote ? '报价' : '调整报价';
	}

	// 调整数量或价格
	goAdjust (page) {
		this.params.toPage = page
		let modal = this.modalCtrl.create(EnquiryAdjustPage, this.params);
		modal.onDidDismiss(res => {
			if (!res.closeModal) {
				this.params.price = res.price;
				this.params.quantity = res.quantity;
			}
		})
		modal.present();
	}

	// 确定
	confirm () {
		if (this.validate()) {
			this.toastCtrl.create({
				message: this.validate(),
				duration: 1200,
				position: 'middle',
				dismissOnPageChange: true
			}).present();
		} else {
			this.requesting = true;
			this.enquiryService.sellerOperation(this.params).then(res => {
				this.navCtrl.pop();
			}).catch(err => {
				this.requesting = false;
			})
		}
	}

	validate () {
		let list = [
			{
				value: this.params.quantity,
				errorMsg: '请输入销售数量'
			},
			{
				value: this.params.price,
				errorMsg: '请输入单价'
			}
		]
		for (let item of list) {
			if (!item.value) {
				return item.errorMsg;
			}
		}
	}

}
