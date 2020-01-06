import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, Navbar, ModalController, ViewController, ToastController, App } from 'ionic-angular';

import { EnquiryService } from './enquiry.service';
import { AddressListPage } from '../address/address-list/address-list';
import { ResourceDetailPage } from '../resource/resource-detail/resource-detail';
import { TabsPage } from '../tabs/tabs';
import { CommonDialog } from '../../components/common-dialog/common-dialog';

@Component({
  selector: 'page-enquiry',
  templateUrl: 'enquiry.html'
})
export class EnquiryPage {
  @ViewChild(Navbar) navBar: Navbar;
  resourceDetailPage: any;
  TabsPage: any;
  navData: any;
  step: number = 0;
  quantity: any;
  singlePurchaseUnit: any;
  minNumLimit: any;
  canSellNum: any;
  price: any;
  enterprises: any;
  enquiryTips: any;
  addressList: any;
  titles: any = this.enquiryService.TITLES;
  payTypes: any = this.enquiryService.PAYMENT_TYPE;
  deliveryModes: any = this.enquiryService.DELIVERY_MODE;
  transportations: any = this.enquiryService.TRANSPORTATION;
  paymentMethods: any = this.enquiryService.PAYMENT_METHOD;
  title: any;
  commonDialog: any;
  deliveryMethod: any;
  requestLoading: boolean;
  requestFailed: boolean;
  reloadEnterprise: boolean;

  enquiryParams: any = {
    resourceId: "",
    price: 0,
    quantity: 0,
    deliveryMethod: "",
    shippingMethod: "",
    deliveryAddressId: "",
    enquiryEffDate: "",
    comments: "",
    enterpriseId: "",
    payMode: ""
  };


  constructor(public navCtrl: NavController, navParams: NavParams, private modalCtrl: ModalController, private enquiryService: EnquiryService, private viewCtrl: ViewController, private toastCtrl: ToastController, private app: App) {
    this.resourceDetailPage = ResourceDetailPage;
    this.TabsPage = TabsPage;
    this.commonDialog = CommonDialog;
    this.navData = navParams.data;
    //顶部询价信息栏
    this.enquiryTips = [navParams.data.resourceVO.goodsCateName];
    //最低购买数量
    this.quantity = navParams.data.resourceVO.minNumLimit;
    //默认参考价格
    this.price = navParams.data.resourceVO.price;
    //资源id
    this.enquiryParams.resourceId = this.navData.concactPerson.resourceId;
    // 最小递增值
    this.singlePurchaseUnit = this.navData.resourceVO.singlePurchaseUnit || 0;
    this.minNumLimit = this.navData.resourceVO.minNumLimit;
    this.canSellNum = this.navData.resourceVO.canSellNum;
    if (this.navData.checkedAddress) {
      this.step = this.navData.step;
      this.enquiryTips = this.navData.enquiryTips;
      this.enquiryParams = this.navData.enquiryParams;
      this.enquiryParams.deliveryAddressId = this.navData.checkedAddress.deliveryAddressId;
      this.submitEnquiry();
    }

    this.title = this.titles[this.step].value;

    //获取可购买企业
    this.getEnterprise();
  }

  ionViewDidLoad () {
    this.navBar.backButtonClick = (e: UIEvent) => {
      this.navData.resourceId = this.navData.resourceVO.resourceId;
      this.step > 0 ? (this.step === 2 ? (this.navData.resourceVO.bargainMethod === "1" ? this.step -= 2 : this.step--) : this.step--) : this.viewCtrl.dismiss();
      this.enquiryTips.splice(this.enquiryTips.length - 1, 1);
      this.title = this.titles[this.step].value;
    }
  }

  ionViewWillEnter () {
    if (this.step == 5 && !this.navData.checkedAddress) {
      this.enquiryTips.splice(this.enquiryTips.length - 1, 1);
    }
  }

  //bargainMethod：1-买家询价(无期望价格选择)，2-买家报价
  confirm () {
    let priceRegExp = /^(?:0\.\d{1,2}|(?!0)\d+(?:\.\d{1,2})?)$/;
    let countRegExp = /^(?:0\.\d{1,2}|(?!0)\d+(?:\.\d{1,3})?)$/;
    if (this.step === 1 && (!priceRegExp.test(this.price) || (this.price + '').length > 9)) {
      this.showToast('请输入正确的价格(最多2位小数)');
      return;
    } else if (this.step === 0 && (!countRegExp.test(this.quantity) || (this.quantity + '').length > 11)) {
      this.showToast('请输入正确的数量(最多3位小数)');
      return;
    } else if (this.step === 0 && this.quantity < this.navData.resourceVO.minNumLimit) {
      this.showToast(`购买数量不能小于最小起订量${this.navData.resourceVO.minNumLimit}${this.navData.resourceVO.uomStr}`);
      return;
    }
    this.step === 0 ? this.enquiryTips.push(this.quantity + this.navData.resourceVO.uomStr) : this.enquiryTips.push("￥" + this.price);
    this.navData.resourceVO.bargainMethod === "1" ? this.step += 2 : this.step++;
    this.title = this.titles[this.step].value;
  }

  showToast (value) {
    this.toastCtrl.create({
      message: value,
      duration: 2000,
      position: 'middle',
      dismissOnPageChange: true
    }).present();
  }

  //选择购买企业
  checkEnterprise (id, value) {
    value.length > 6 ? this.enquiryTips.push(value.substring(0, 6) + "...") : this.enquiryTips.push(value)
    this.enquiryParams.enterpriseId = id;
    this.step++;
    this.title = this.titles[this.step].value;
  }

  // 选择支付方式
  checkPaymentMethod (id, value) {
    this.enquiryTips.push(value);
    this.enquiryParams.payMode = id;
    this.step++;
    this.title = this.titles[this.step].value;
  }

  //选择物流方式
  checkDeliveryMode (id, value) {
    this.enquiryTips.push(value);
    this.deliveryMethod = value;
    this.enquiryParams.price = this.price;
    this.enquiryParams.quantity = this.quantity;
    this.enquiryParams.deliveryMethod = id;
    this.title = this.titles[this.step].value;
    value === "自提" ? this.submitEnquiry() : this.step++;
  }

  // 选择配送方式
  checkTransportation (id, value) {
    this.enquiryTips.push(value);
    this.enquiryParams.shippingMethod = id;
    this.goAddAddress();
  }

  //询盘申请
  submitEnquiry () {
    this.requestLoading = true;
    this.enquiryService.submitEnquiryApply(this.enquiryParams).then(res => {
      this.requestLoading = false;
      this.openCommonDialog();
    }).catch(res => {
      this.requestLoading = false;
    })
  }

  //选择配送地址
  goAddAddress () {
    this.navData.enquiryTips = this.enquiryTips;
    this.navData.enquiryParams = this.enquiryParams;
    this.navCtrl.push(AddressListPage, this.navData);
  }

  // 询价结果弹窗
  openCommonDialog () {
    if (!this.navData.concactPerson.logo) {
      this.navData.concactPerson.logo = "assets/imgs/user.png";
    }
    let modalPage = this.modalCtrl.create(this.commonDialog, {
      message: "“ 我已收到你所提交的信息， 我将在认真评估后，给你答复。”",
      logo: this.navData.concactPerson.logo
    }, {
        showBackdrop: false,
        enterAnimation: 'modal-alert-enter',
        leaveAnimation: 'modal-alert-leave',
        enableBackdropDismiss: false
      });

    modalPage.onDidDismiss(res => {
      // this.app.getRootNav().setRoot(TabsPage);
      this.app.getRootNavs()[0].setPages([{
        page: TabsPage,
        params: {
          tabIndex: 2
        }
      }])
    })

    modalPage.present();
  }

  //可购买企业
  getEnterprise () {
    this.reloadEnterprise = true;
    this.enquiryService.getEnterprise({
      "enterpriseId": this.navData.concactPerson.enterpriseId,
      "goodsCateId": this.navData.resourceVO.goodsCateId,
      "resourceId": this.navData.resourceVO.resourceId
    }).then(res => {
      this.enterprises = res;
      this.reloadEnterprise = false;
    }).catch(err => {
      this.reloadEnterprise = false;
      this.requestFailed = true;
    })
  }

  goTabs () {
    this.app.getRootNav().setRoot(TabsPage);
  }

  // 增加数量
  addQuantity () {
    this.quantity = parseFloat(this.quantity)
    if (this.singlePurchaseUnit && this.quantity) {
      if (this.quantity >= this.canSellNum - this.singlePurchaseUnit) {
        this.quantity = this.canSellNum;
        this.toastTips(`可售量为${this.canSellNum}${this.navData.resourceVO.uomStr}`);
      } else {
        this.quantity += this.singlePurchaseUnit;
      }
    }
    this.autoCalcQuantity();
  }

  // 减少数量
  reduceQuantity () {
    this.quantity = parseFloat(this.quantity)
    if (this.singlePurchaseUnit && this.quantity) {
      if (this.quantity <= 0 || this.quantity <= this.minNumLimit + this.singlePurchaseUnit) {
        this.quantity = this.minNumLimit;
        this.toastTips(`最小起订量为${this.minNumLimit}${this.navData.resourceVO.uomStr}`);
      } else {
        this.quantity -= this.singlePurchaseUnit;
      }
    }
    this.autoCalcQuantity();
  }

  autoCalcQuantity () {
    if (!this.quantity) this.quantity = this.minNumLimit || 0;
    if (this.quantity <= this.minNumLimit) {
      this.quantity = this.minNumLimit
    } else if (this.quantity >= this.canSellNum) {
      this.quantity = this.canSellNum;
    } else {
      if (this.singlePurchaseUnit) {
        var multiple = Math.round((this.quantity - this.minNumLimit) / this.singlePurchaseUnit);
        this.quantity = this.minNumLimit + multiple * this.singlePurchaseUnit;
      }
    }
    this.quantity = parseFloat(this.quantity).toFixed(3);
  }

  toastTips (msg) {
    this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'middle'
    }).present();
  }

}
