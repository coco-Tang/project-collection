import { Component, ViewChild } from '@angular/core';
import { Events, NavController, NavParams, Refresher, ModalController, Content, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { ResourceService } from '../../resource/resource.service';
import { EnquiryService } from '../enquiry.service';
import { OrderPage } from '../../order/order-detail/order';
import { EnquiryDetailPage } from "../enquiry-detail/enquiry-detail";
import { UpdateCountModal } from '../../../components/update-count-modal/update-count-modal';
import { EnquiryAdjustListPage } from '../adjust/list/enquiry-adjust-list';
import { STORAGE_CONSTANT } from '../../../config/storage'
import { ResourceDetailPage } from '../../resource/resource-detail/resource-detail';
import { Helper } from '../../../utils/helper';

@Component({
	selector: 'page-chat',
	templateUrl: 'chat.html'
})

export class ChatPage {
	@ViewChild(Refresher) refresher: Refresher;
	@ViewChild(Content) content: Content;
	transactionType: any = this.resourceService.TRANSACTION_TYPE_ENUM;
	operations: any = this.enquiryService.OPERATION_ENUM;
	chatList: any = {
		buttonType: [],
		dialogueDetailListTOs: []
	};
	userId: any;
	orderPage: any;
	enquiryDetailPage: any;
	enquiryAdjustListPage: any = EnquiryAdjustListPage;
	resourceDetailPage: any = ResourceDetailPage;
	adjustModal: any;
	title: any;
	buyerOperation: any = this.enquiryService.BUYER_OPERATION;
	isLoading: boolean = true;
	requesting: boolean = false;
	params: any = {
		follower: '',
		receiver: '',
		resourceId: '',
		comments: '',
		enquiryId: '',
		enterpriseId: '',
	}
	updateCountModal: any = UpdateCountModal;

	// 取最近一条聊天记录中的参数
	operationParams: any;

	constructor(public events: Events, private resourceService: ResourceService, private enquiryService: EnquiryService, private navParams: NavParams, public modalCtrl: ModalController, private storage: Storage, private navCtrl: NavController, private alertCtrl: AlertController, private helper: Helper) {
		this.params.follower = this.navParams.get('follower');
		this.params.receiver = this.navParams.get('receiver');
		this.params.resourceId = this.navParams.get('resourceId');
		this.params.enquiryId = this.navParams.get('enquiryId');
		this.title = this.navParams.get('enterpriseName');

		this.storage.get(STORAGE_CONSTANT.USER_ID).then(uid => {
			if (uid) this.userId = uid;
		})

		this.orderPage = OrderPage;
		this.enquiryDetailPage = EnquiryDetailPage;
	}

	// 加载沟通列表
	loadChatList () {
		return new Promise((resolve, reject) => {
			this.enquiryService.getChatList(this.params).then(res => {
				this.isLoading = false;
				this.chatList = res;
				this.operationParams = res.dialogueDetailListTOs[res.dialogueDetailListTOs.length - 1];
				resolve(res);
				this.scrollToBottom();
			}).catch(err => this.isLoading = false);
		})
	}

	// 每次进入页面都更新数据
	ionViewWillEnter () {
		this.loadChatList()
	}

	// 下拉刷新
	doRefresh () {
		this.loadChatList().then(res => {
			this.refresher.complete();
		})
	}

	doPull (event) {
		this.helper.elasticRefresh(event);
	}


	// 去调整报价页面进行同意、调整、报价
	goAdjustListPage (operationId) {
		if (operationId == this.buyerOperation.agree) {
			let { enquiryId, price, quantity } = this.operationParams;
			this.requesting = true;
			this.enquiryService.sellerOperation({
				enquiryId,
				price,
				quantity,
				enterpriseId: this.navParams.get('enterpriseId')
			}).then(res => {
				this.loadChatList();
				this.requesting = false;
			}).catch(err => {
				this.requesting = false;
			})
		} else {
			this.operationParams.operationId = operationId;
			this.operationParams.enterpriseId = this.navParams.get('enterpriseId');
			let modal = this.modalCtrl.create(this.updateCountModal, this.operationParams, {
				showBackdrop: true,
				enterAnimation: 'modal-alert-enter',
				leaveAnimation: 'modal-alert-leave',
				enableBackdropDismiss: true,
				cssClass: 'adjust-quantity-modal'
			});
			modal.onDidDismiss(data => {
				if (data.adjustSuccess) {
					this.loadChatList();
				} else if (data) {
					this.navCtrl.push(this.enquiryAdjustListPage, data);
				}
			})
			modal.present();
		}
	}

	// 滚动到底部
	scrollToBottom () {
		setTimeout(() => {
			if (this.content.scrollToBottom) {
				this.content.scrollToBottom(600);
			}
		}, 200)
	}


	// 买家拒绝
	buyerReject () {

		let alert = this.alertCtrl.create({
			message: '您确定要拒绝此交易吗？',
			buttons: [
				{
					text: '我再想想',
					role: 'cancel',
				},
				{
					text: '拒绝交易',
					handler: () => {
						this.requesting = true;
						this.enquiryService.buyerReject({
							comments: '',
							enquiryId: this.operationParams.enquiryId,
							enterpriseId: this.navParams.get('enterpriseId')
						}).then(res => {
							this.requesting = false;
							this.doRefresh();
						}).catch(err => this.requesting = false)
					}
				}
			]
		});
		alert.present();
	}

	gotoDetail () {
		if (this.operationParams.orderId) {
			this.navCtrl.push(this.orderPage, { orderId: this.operationParams.orderId });
		} else {
			this.navCtrl.push(this.enquiryDetailPage, this.operationParams);
		}
	}

}