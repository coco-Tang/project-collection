import { Component, ViewChild } from '@angular/core';
import { NavController, Refresher, InfiniteScroll, ModalController, NavParams } from 'ionic-angular';
import { FollowPage } from '../follow/follow';
import { ResourceDetailPage } from '../../pages/resource/resource-detail/resource-detail';
import { CityPickerModal } from './city-picker-modal/city-picker-modal'
import { CategoryService } from '../category/category.service';
import { StatusBar } from '@ionic-native/status-bar';
import { HomeService } from './home.service';
import moment from 'moment';
import { Storage } from '@ionic/storage';
import { STORAGE_CONSTANT } from '../../config/storage';
import { Helper } from '../../utils/helper';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  @ViewChild(Refresher) refresher: Refresher;
  @ViewChild(InfiniteScroll) infiniteScroll: InfiniteScroll;
  categoryList: any = [];
  followedList: any = [];
  manufactureList: any = [];
  totalPage: number;
  showManufacturePicker: boolean = false;
  useAnimation: boolean = false;
  TRANSACTION_REFERENCE: any;
  refreshing: boolean = false;
  selectedManufacturerId: any = '';
  selectedManufacturerName: any = '';
  // 获取商品列表的参数
  params: any = {
    manufacturerId: '',
    manufacturerName: '',
    goodsCateIdLevel3: '',
    provinceCode: '',
    provinceName: '',
    page: {
      pageNo: 1,
      pageSize: 10,
    }
  }
  // 86 和 2 获取所有城市列表
  cityParams: any = {
    areaPid: '86',
    nodeLevel: '2'
  }
  // 获取厂商列表参数
  manufactureParams: any = {
    goodsCateId: '',
    pageNo: 1,
    pageSize: 100,
  }
  resourceListPage: any;
  chatPage: any;
  followPage: any;
  detailPage: any;
  isLoading: boolean = false;
  hideTips: boolean = false;
  operationTime: any;

  constructor(public navParams: NavParams, public navCtrl: NavController, private categoryService: CategoryService, private statusBar: StatusBar, private homeService: HomeService, private storage: Storage, private modalCtrl: ModalController, private helper: Helper) {
    this.detailPage = ResourceDetailPage;
    this.followPage = FollowPage;
    this.TRANSACTION_REFERENCE = homeService.TRANSACTION_REFERENCE;
    this.getCurrentCity();
    this.storage.get(STORAGE_CONSTANT.HIDE_OPERATION_TIME).then((value) => {
      this.hideTips = value ? true : false;
      if (!value) this.getOperationTime();
    });
  }

  // 获取定位所在城市
  getCurrentCity () {
    this.storage.get(STORAGE_CONSTANT.CURRENT_LOCATION).then(value => {
      if (value.latitude && value.longitude) {
        this.isLoading = true;
        this.homeService.getCurrentCityByLocation(value).then(res => {
          this.isLoading = false;
          this.params.provinceCode = res.provinceCode;
          this.params.provinceName = res.provinceName;
          this.loadFollowedList();
        })
      } else if (value.provinceCode && value.provinceName) {
        this.params.provinceCode = value.provinceCode;
        this.params.provinceName = value.provinceName;
        this.loadFollowedList();
      } else {
        this.params.provinceCode = '310000';
        this.params.provinceName = '上海';
        this.loadFollowedList();
      }
    })
  }

  // 关闭开市闭市时间提示
  closeTips () {
    this.storage.set(STORAGE_CONSTANT.HIDE_OPERATION_TIME, true);
    this.hideTips = true;
  }

  // 获取开市闭市时间
  getOperationTime () {
    this.homeService.getOperationTime().then(res => {
      this.operationTime = `开市时间：${moment(res.tranBeginTime).format('HH:mm')} —— ${moment(res.tranEndTime).format('HH:mm')}`;
    })
  }

  // 获取顶部关注列表
  loadFollowedList () {
    this.isLoading = true;
    this.categoryService.getFollowList({
      pageNo: 1,
      pageSize: 200
    }).then(res => {
      this.isLoading = false;
      if (res.rows) this.followedList = res.rows || [];
      this.followedList.length > 0 ? this.params.goodsCateIdLevel3 = this.followedList[0].goodsCateId : '';
      this.getGoodsCategoryList();
      this.loadManufactureList();
    }).catch(err => {
      this.isLoading = false;
    })
  }

  // 获取首页商品列表
  getGoodsCategoryList () {
    this.isLoading = true;
    return new Promise((resolve, reject) => {
      this.categoryService.getGoodsCategoryTree(this.params).then(res => {
        this.isLoading = false;
        if (this.refreshing) {
          this.categoryList = [];
        }
        this.categoryList = this.followedList.length > 0 ? this.categoryList.concat(res.goodsResults) : [];
        this.totalPage = Math.ceil(res.totalCount / this.params.page.pageSize);
        for (let item of this.categoryList) {
          item.effectTime = new Date(item.effectTime.replace(/-/g, '/')) > new Date() ? '有效期至：' + moment(item.effectTime).format('HH:mm') : '已失效'
        }
        resolve(this.categoryList);
      }).catch(err => {
        this.isLoading = false;
        reject(err);
      })
    })
  }

  // 切换首页分类
  toggleCategory (id) {
    this.showManufacturePicker = false;
    this.params.page.pageNo = 1;
    this.categoryList = [];
    this.params.goodsCateIdLevel3 = id;
    this.getGoodsCategoryList();
    this.loadManufactureList();
    this.toggleAnimation();
  }

  // 加载厂商下拉筛选列表
  loadManufactureList () {
    this.manufactureParams.goodsCateId = this.params.goodsCateIdLevel3;
    this.homeService.getManufactureList(this.manufactureParams).then(res => {
      if (res.rows) this.manufactureList = res.rows || [];
    }).catch(err => { })
  }

  // 选择城市
  openCityPicker () {
    this.showManufacturePicker = false;
    let cityPicker = this.modalCtrl.create(CityPickerModal, {
      provinceCode: this.params.provinceCode,
      provinceName: this.params.provinceName
    }, {
        showBackdrop: false,
        enterAnimation: 'modal-show-enter',
        leaveAnimation: 'modal-alert-leave'
      });
    cityPicker.onDidDismiss(data => {
      if (data) {
        this.params.provinceName = data.provinceName;
        this.params.provinceCode = data.provinceCode;
        this.categoryList = [];
        this.getGoodsCategoryList()
      }
    });
    cityPicker.present();
  }

  // 切换厂商下拉
  toggleManufactureList () {
    this.showManufacturePicker = !this.showManufacturePicker;
    this.selectedManufacturerId = this.params.manufacturerId || '';
    this.selectedManufacturerName = this.params.manufacturerName || '';
    this.useAnimation = true;
    this.toggleAnimation();
  }

  toggleAnimation () {
    if (!this.showManufacturePicker) {
      setTimeout(res => {
        this.useAnimation = false;
      }, 250)
    }
  }

  // 选择厂商
  selectManufacture (id, name) {
    this.selectedManufacturerId = id;
    this.selectedManufacturerName = name;
  }

  // 通过过滤条件筛选产品列表
  searchCategory () {
    this.params.manufacturerId = this.selectedManufacturerId;
    this.params.manufacturerName = this.selectedManufacturerName;
    this.showManufacturePicker = false;
    this.toggleAnimation()
    this.categoryList = [];
    this.getGoodsCategoryList();
  }

  // 进入页面更新状态栏
  ionViewDidEnter () {
    this.useAnimation = false;
    this.statusBar.styleLightContent();
  }

  ionViewWillLeave () {
    this.showManufacturePicker = false;
  }

  gotoFollowPage () {
    this.navCtrl.push(FollowPage);
  }

  // 下拉刷新页面
  doRefresh () {
    this.refreshing = true;
    this.params.page.pageNo = 1;
    this.getGoodsCategoryList().then(res => {
      this.refreshing = false;
      this.refresher.complete();
    }).catch(err => {
      this.refreshing = false;
      this.refresher.complete();
    })
  }

  doPull (event) {
    this.helper.elasticRefresh(event);
  }

  // 上拉加载翻页
  doInfinite () {
    this.params.page.pageNo += 1;
    if (this.params.page.pageNo > this.totalPage) {
      this.infiniteScroll.complete();
      return;
    }
    this.getGoodsCategoryList().then(res => {
      this.infiniteScroll.complete();
    }).catch(err => {
      this.infiniteScroll.complete();
    })
  }

}
