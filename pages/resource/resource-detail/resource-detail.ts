import { Component } from '@angular/core';
import { NavController, NavParams, Platform } from 'ionic-angular';
import { EnquiryPage } from '../../enquiry/enquiry'
import { ResourceListPage } from '../list/resource-list'
import { ResourceService } from '../resource.service'
import { StatusBar } from '@ionic-native/status-bar';
import moment from 'moment';
import { HomeService } from '../../home/home.service';
import { PhotoViewer } from '@ionic-native/photo-viewer';

@Component({
  selector: 'page-resource-detail',
  templateUrl: 'resource-detail.html'
})
export class ResourceDetailPage {
  logo: string;
  qualityUrl: any;
  resource: any;
  navData: any;
  EnquiryPage: any;
  deliveryMode: any = this.resourceService.DELIVERY_MODE;
  transactionType: any = this.resourceService.TRANSACTION_TYPE_ENUM;
  isLoading: boolean = true;
  ifShow: boolean = true;
  resourceInfo: any;
  goodsCateId: string;
  goodsCateName: string;
  resourceListPage: any;
  showReport: Boolean;
  isVaild: Boolean = true;
  isOperation: Boolean = true;

  constructor(public navCtrl: NavController, navParams: NavParams, private statusBar: StatusBar, private resourceService: ResourceService, private platForm: Platform, private homeService: HomeService, private photoViewer: PhotoViewer) {
    this.EnquiryPage = EnquiryPage;
    this.navData = navParams.data;
    this.resourceListPage = ResourceListPage;
    this.getResourceDetail();
  }

  getResourceDetail () {
    this.resourceService.getResourceDetail(this.navData.resourceId).then(res => {
      this.resource = res;
      this.resourceInfo = res.resourceVO;
      this.isVaild = new Date(this.resourceInfo.effectTime.replace(/-/g, '/')) > new Date();
      this.resourceInfo.effectTime = this.isVaild ? '有效期至：' + moment(this.resourceInfo.effectTime).format('HH:mm') : '已失效';
      if (this.resourceInfo.earliestDeliveryTime && this.resourceInfo.lastDeliveryTime) {
        this.resourceInfo.earliestDeliveryTime = moment(this.resourceInfo.earliestDeliveryTime).format('YYYY/MM/DD');
        this.resourceInfo.lastDeliveryTime = moment(this.resourceInfo.lastDeliveryTime).format('YYYY/MM/DD');
      }
      this.qualityUrl = res.resourceVO.qualityUrl || '';
      this.goodsCateId = this.resource.resourceVO.goodsCateId;
      this.goodsCateName = this.resource.resourceVO.goodsCateName;
      this.logo = this.resource.concactPerson.logo ? this.resource.concactPerson.logo : 'assets/imgs/user.png';
      this.getOperationTime();
    })
  }

  // 获取开市闭市时间
  getOperationTime () {
    this.homeService.getOperationTime().then(res => {
      this.isLoading = false;
      this.isOperation = res.openStatus;
    }, function () {
      this.isLoading = false;
    })
  }

  // 品质报告单
  showReporter () {
    this.photoViewer.show(this.qualityUrl, '', { share: false })
  }

  goAsking () {
    this.navData.resourceId = this.navData.resourceId;
    this.navCtrl.push(this.EnquiryPage, this.resource);
  }

  ionViewWillEnter () {
    //订单详情页进入时隐藏咨询按钮
    this.ifShow = true;
    if (this.platForm.is('ios')) this.statusBar.styleDefault();
  }

  ionViewDidLeave () {
    this.statusBar.styleLightContent();
  }
}
