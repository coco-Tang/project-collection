import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Platform, NavController, NavParams, ModalController, App } from 'ionic-angular';

import { EnquiryService } from '../enquiry.service';
import { OrderService } from '../../order/order.service'
import { StatusBar } from '@ionic-native/status-bar';
import { STORAGE_CONSTANT } from '../../../config/storage';

import { ResourceDetailPage } from '../../resource/resource-detail/resource-detail';
import { TabsPage } from '../../tabs/tabs';
import { CommonDialog } from '../../../components/common-dialog/common-dialog';

@Component({
	selector: 'page-enquiry-detail',
	templateUrl: 'enquiry-detail.html'
})
export class EnquiryDetailPage {
	resourceDetailPage: any;
	TabsPage: any;
	items: any;
	navData: any;
	enquiryDetail: any;
	commonDialog: any;

	disabled: boolean = false;
	isLoading: boolean = true;
	submitText: string = "";
	payType: any;
	deliveryMethodType: any;
	deliveryDateLabel: any;
	detailAddressName: any;
	ifShowCargoAddress: any;
	payTypes: any = this.orderService.PAYMENT_TYPE;
	orderStatus: any = this.orderService.ORDER_STATUS;
	deliveryMethodTypes: any = this.orderService.DELIVERY_MODE;
	userId: string;

	params: any = {
		deliveryAddressId: "",
		enquiryId: ""
	}

	constructor(public statusBar: StatusBar, public platForm: Platform, public navCtrl: NavController, navParams: NavParams, private app: App, private modalCtrl: ModalController, public orderService: OrderService, private enquiryService: EnquiryService, public storage: Storage) {
		this.resourceDetailPage = ResourceDetailPage;
		this.TabsPage = TabsPage;
		this.navData = navParams.data;
		this.commonDialog = CommonDialog;

		this.storage.get(STORAGE_CONSTANT.USER_ID).then(uid => {
			if (uid) this.userId = uid;
		})

		this.enquiryService.getEnquiryDetail(this.navData.enquiryId).then(res => {
			this.isLoading = false;
			this.enquiryDetail = res;

			this.params.deliveryAddressId = this.enquiryDetail.deliveryAddressId;
			this.params.enquiryId = this.enquiryDetail.enquiryId;

			this.payType = this.payTypes[this.enquiryDetail.payMethod - 1].value;

			if (this.enquiryDetail.deliveryMethod == this.deliveryMethodTypes[0].id) {
				this.deliveryDateLabel = "提货";
				this.ifShowCargoAddress = true;
				this.deliveryMethodType = this.deliveryMethodTypes[0].value;
				this.detailAddressName = this.enquiryDetail.cargoAddress;
			} else {
				this.deliveryDateLabel = "交货";
				this.ifShowCargoAddress = false;
				this.deliveryMethodType = this.deliveryMethodTypes[1].value;
				this.detailAddressName = this.enquiryDetail.deliveryAddressName;
			}


			//买家可进行下单操作
			if (this.enquiryDetail.receiver === this.userId) {
				this.disabled = false;
				this.submitText = "同意并下单";
			} else {
				this.disabled = true;
				this.submitText = "等待对方接受";
			}
		}).catch(res => {
			this.isLoading = false;
		})
	}

	gotoOrder () {
		this.disabled = true;
		this.orderService.gotoOrder(this.params).then(res => {
			this.disabled = true;
			this.openCommonDialog();
		}).catch(res => {
			this.disabled = false;
		})
	}


	//结果弹窗
	openCommonDialog () {
		if (!this.enquiryDetail.logo) {
			this.enquiryDetail.logo = "assets/imgs/user.png";
		}
		let modalPage = this.modalCtrl.create(this.commonDialog, {
			message: "“ 下单成功，请前往壹化 网电脑端进行签章，支付等 操作。”",
			logo: this.enquiryDetail.logo
		}, {
				showBackdrop: false,
				enterAnimation: 'modal-alert-enter',
				leaveAnimation: 'modal-alert-leave',
				enableBackdropDismiss: false
			});

		modalPage.onDidDismiss(res => {
			this.app.getRootNavs()[0].setPages([{
				page: TabsPage,
				params: {
					tabIndex: 2
				}
			}])
		})

		modalPage.present();
	}

	ionViewWillEnter () {
		if (this.platForm.is('ios')) this.statusBar.styleDefault();
	}

	ionViewDidUnload () {
		this.statusBar.styleLightContent();
	}
}
