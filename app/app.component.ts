import { Component, ViewChild, enableProdMode } from '@angular/core';
import { Platform, Config, IonicApp, ToastController, Events } from 'ionic-angular';
import { RequestOptions } from '@angular/http';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { STORAGE_CONSTANT } from '../config/storage';
import { Storage } from '@ionic/storage';
import { UMENG_ENABLE, APP_VERSION } from '../config/common';
import { TabsPage } from '../pages/tabs/tabs';
import { LoginPage } from '../pages/auth/login/login';

import { UpdateService } from '../services/update.service';
import { AuthService } from '../services/auth.service'
import { AppVersion } from '@ionic-native/app-version';
import { NotificationService } from '../services/notification.service'

import { ModalScaleEnter, ModalScaleLeave, ModalAlertEnter, ModalAlertLeave, ModalShowEnter, ModalConfirmLeave } from "./modal-transitions";
import { Subscription } from 'rxjs';
declare const AMap: any;
enableProdMode();

@Component({
  templateUrl: 'app.html'
})
export class ChemicApp {

  type: any;
  @ViewChild('chemicNav') nav;
  rootPage: any;
  backButtonPressed: boolean = false;
  timer: any;

  private onResumeSubscription: Subscription;

  constructor(private notificationService: NotificationService, public ionicApp: IonicApp, public platform: Platform, private requestOptions: RequestOptions, private appVersion: AppVersion, public toastCtrl: ToastController, public config: Config, public statusBar: StatusBar, private storage: Storage, public splashScreen: SplashScreen, private updateService: UpdateService, private events: Events, private authService: AuthService) {
    this.getCurrentPage();
    //订阅resume事件，切换应用时检测更新
    this.onResumeSubscription = platform.resume.subscribe(() => {
      this.updateService.detectionUpgrade();
    });
    this.events.subscribe("user:logout", () => {
      this.authService.logout(true);
    });

    this.setCustomTransitions();
    this.platformReady();
  }

  platformReady () {
    this.platform.ready().then(() => {
      this.statusBar.show();
      this.splashScreen.hide();
      if (this.platform.is('mobile') && !this.platform.is('mobileweb')) {
        this.appVersion.getVersionNumber().then((version: string) => {
          this.requestOptions.headers.set('version', version)
        }).catch(() => { })
      } else {
        this.requestOptions.headers.set('version', APP_VERSION)
      }
      this.registerBackButtonAction();
      this.getGeolocation();
      //检测更新
      this.updateService.detectionUpgrade();
      // 初始化极光推送
      this.notificationService.initJpush();
      this.jPushOpenNotification();
      //启动umeng
      this.startUmeng();
    })
  }

  //启动友盟统计
  startUmeng () {
    if (UMENG_ENABLE) {
      let mobclickAgent = (<any>window).MobclickAgent;
      if (mobclickAgent) {
        mobclickAgent.init();
        mobclickAgent.setDebugMode(false);//测试模式
      }
    }
  }

  getCurrentPage () {
    this.storage.get(STORAGE_CONSTANT.HAS_LOGGED_IN).then((value) => {
      value ? this.rootPage = TabsPage : this.rootPage = LoginPage;
    })
  }

  private setCustomTransitions () {
    this.config.setTransition('modal-scale-enter', ModalScaleEnter);
    this.config.setTransition('modal-scale-leave', ModalScaleLeave);
    this.config.setTransition('modal-alert-enter', ModalAlertEnter);
    this.config.setTransition('modal-alert-leave', ModalAlertLeave);
    this.config.setTransition('modal-show-enter', ModalShowEnter);
    this.config.setTransition('modal-confirm-leave', ModalConfirmLeave);
  }

  // 获取当前定位
  getGeolocation () {
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
        this.storage.set(STORAGE_CONSTANT.CURRENT_LOCATION, {
          latitude: res.position.lat,
          longitude: res.position.lng
        })
      });
    });
  }

  //注册安卓返回按钮事件
  registerBackButtonAction () {
    this.platform.registerBackButtonAction(() => {
      //如果想点击返回按钮隐藏toast或loading或Overlay就把下面加上
      this.ionicApp._toastPortal.getActive() || this.ionicApp._loadingPortal.getActive() || this.ionicApp._overlayPortal.getActive();
      let activePortal = this.ionicApp._modalPortal.getActive();
      if (activePortal) {
        activePortal.dismiss().catch(() => { });
        activePortal.onDidDismiss(() => { });
        return;
      }

      let activeVC = this.nav.getActive();
      let page = activeVC.instance;
      //此处if是rootPage为登录页的情况，else是rootPage为TabsPage（如果不需要判断登录页的情况直接用else内的代码即可）  
      if (!(page instanceof TabsPage)) {
        this.nav.canGoBack() ? this.nav.pop() : this.showExit();
      }
      else {
        let tabs = page.tabs;
        let activeNav = tabs.getSelected();
        activeNav.canGoBack() ? activeNav.pop() : this.showExit();
      }
    }, 1);
  }

  //双击退出提示框
  showExit () {
    if (this.backButtonPressed) { //当触发标志为true时，即2秒内双击返回按键则退出APP
      this.platform.exitApp();
    } else {
      if (this.timer) clearTimeout(this.timer);
      this.toastCtrl.create({
        message: '再按一次退出应用',
        duration: 2000,
        position: 'middle'
      }).present();
      this.backButtonPressed = true;
      //2秒内没有再次点击返回则将触发标志标记为false
      this.timer = setTimeout(() => this.backButtonPressed = false, 2000);
    }
  }

  // 极光推送
  jPushOpenNotification () {
    if (this.platform.is('cordova')) {
      // 当点击极光推送消息跳转到指定页面
      this.events.subscribe('jpush.openNotification', content => {
        const childNav = this.nav.getActiveChildNav();
        if (childNav) {
          const tab = childNav.getSelected();
          const activeVC = tab.getActive();
          // if (activeVC.component == AboutPage) {//如果当前所在页面就是将要跳转到的页面则不处理
          //   return;
          // }
          const activeNav = activeVC.getNav();
          activeNav.popToRoot({}).then(() => { // 导航跳到最顶层
            childNav.select(0); // 选中第1个tab
            const t = childNav.getSelected(); // 获取选中的tab
            const v = t.getActive(); // 通过当前选中的tab获取ViewController
            const n = v.getNav(); // 通过当前视图的ViewController获取的NavController
            // n.push(AboutPage); // 跳转到指定页面
          });
        }
      });
    }
  }

  ngOnDestroy () {
    this.events.unsubscribe("user:logout");
    this.onResumeSubscription.unsubscribe();
  }
}
