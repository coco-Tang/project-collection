import { Component } from "@angular/core";
import { ViewController, ToastController, LoadingController, NavParams } from 'ionic-angular';
import { HomeService } from '../home.service'
import { Storage } from '@ionic/storage';
import { STORAGE_CONSTANT } from '../../../config/storage';
declare const AMap: any; //声明
@Component({
	selector: 'city-picker-modal',
	templateUrl: 'city-picker-modal.html'
})

export class CityPickerModal {
	cityList: any = [];
	citySearchHistory: any = [];
	currentLocation: any = {
		provinceCode: '',
		provinceName: ''
	};
	constructor(private viewCtrl: ViewController, private homeService: HomeService, private storage: Storage, private toastCtrl: ToastController, private loadingCtrl: LoadingController, private navParams: NavParams) {
		this.getCityList();
		this.findCityHistory();
	}

	// 获取定位所在城市
	getCurrentCity () {
		this.currentLocation.provinceCode = this.navParams.get('provinceCode') || '';
		this.currentLocation.provinceName = this.navParams.get('provinceName') || '';
	}

	// 获取当前坐标
	getGeolocation () {
		let loading = this.loadingCtrl.create({
			spinner: 'bubbles',
			content: '定位中 ...'
		});
		loading.present();
		let map = new AMap.Map('iCenter');
		map.plugin('AMap.Geolocation', () => {
			let geolocation = new AMap.Geolocation({
				enableHighAccuracy: true, //是否使用高精度定位，默认:true
				timeout: 6000,            //超过10秒后停止定位，默认：无穷大
				maximumAge: 300000,       //定位结果缓存0毫秒，默认：0
			});
			map.addControl(geolocation);
			geolocation.getCurrentPosition();
			AMap.event.addListener(geolocation, 'complete', res => {
				loading.dismiss();
				this.homeService.getCurrentCityByLocation({
					latitude: res.position.lat,
					longitude: res.position.lng
				}).then(res => {
					this.currentLocation.provinceCode = res.provinceCode;
					this.currentLocation.provinceName = res.provinceName;
				}).catch(err => {
					loading.dismiss();
					this.getLocationError();
				})
			});
			AMap.event.addListener(geolocation, 'error', err => {
				loading.dismiss();
				this.getLocationError();
			});
		});
	}

	getLocationError () {
		this.toastCtrl.create({
			message: '定位获取失败',
			duration: 2000,
			position: 'middle'
		}).present();
	}

	// 获取城市列表
	getCityList () {
		this.homeService.getCityList({
			areaPid: '86',
			nodeLevel: '2'
		}).then(res => {
			this.cityList = res;
		})
	}

	// 获取城市搜索历史
	findCityHistory () {
		this.storage.get(STORAGE_CONSTANT.CITY_SEARCH_HISTORY).then((value) => {
			this.citySearchHistory = value ? value : [];
		});
	}

	selectCity (params) {
		if (this.citySearchHistory.length > 5) {
			this.citySearchHistory.pop();
		}
		this.citySearchHistory.forEach((value, index) => {
			if (value.provinceCode == params.provinceCode) {
				this.citySearchHistory.splice(index, 1);
			}
		});
		this.citySearchHistory.unshift({
			provinceCode: params.provinceCode,
			provinceName: params.provinceName
		});
		this.storage.set(STORAGE_CONSTANT.CITY_SEARCH_HISTORY, this.citySearchHistory);
		this.storage.set(STORAGE_CONSTANT.CURRENT_LOCATION, {
			provinceCode: params.provinceCode,
			provinceName: params.provinceName
		})
		this.closeCityPicker(params);
	}

	// 去首页
	closeCityPicker (params?) {
		this.viewCtrl.dismiss(params);
	}

	ionViewWillEnter () {
		this.getCurrentCity();
	}
}