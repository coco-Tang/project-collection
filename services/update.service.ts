import { Platform, ModalController } from "ionic-angular";
import { Storage } from '@ionic/storage';
import { Injectable } from '@angular/core';

import { API } from '../config/api';
import { STORAGE_CONSTANT } from '../config/storage';

import { HttpService } from '../services/http.service';
import { UpdateModal } from '../components/updateModal/update';
import { UPDATE_DETECT_INTERVAL, APP_VERSION } from '../config/common';

import { AppVersion } from '@ionic-native/app-version';

@Injectable()
export class UpdateService {

  updateModal: any;
  currVersion: string;
  currPlatform: string;
  updateInfo: object;
  updateModalShow: boolean = false;

  nowTime: any;
  versionIgnoreTime: any;
  versionIgnoreCode: any;
  //是否浏览器更新测试
  webDetectionTest: boolean = false;
  //测试对象
  simulation: string = 'ios';
  constructor(private httpService: HttpService, private appVersion: AppVersion, public storage: Storage, private platform: Platform, private modalCtrl: ModalController) {
    this.updateModal = UpdateModal;
  }

  /**
  * 检查app是否需要升级
  */
  detectionUpgrade () {
    this.storage.get(STORAGE_CONSTANT.VERSION_IGNORE).then(versionIgnore => {
      versionIgnore = versionIgnore || {};
      this.versionIgnoreTime = versionIgnore['versionIgnoreTime'] ? new Date(versionIgnore['versionIgnoreTime']) : null;
      this.versionIgnoreCode = versionIgnore['versionIgnoreCode'];
      this.nowTime = new Date();

      // 这里连接后台获取app最新版本号,然后与当前app版本号(this.getVersionNumber())对比
      this.getUpdateInfo().then(updateInfo => {
        let pushTime = new Date(updateInfo['pushTime'].replace(/-/g, '/'));
        //最新版本大于上次忽略版本，则直接提示更新
        if (this.versionIgnoreCode && this.versionCompare(this.versionIgnoreCode, updateInfo['code'])) {
          this.openUpdateModal();
        } else {
          if (!this.versionIgnoreTime || (this.nowTime - this.versionIgnoreTime) >= UPDATE_DETECT_INTERVAL.UPDATE_DETECT_INTERVAL) {
            //如果服务器返回的pushTime小于当前时间，则继续检查更新
            if (pushTime < this.nowTime) {
              //如果服务器返回的版本比当前版本高，则继续
              if (updateInfo['code'] && this.currVersion && this.versionCompare(this.currVersion, updateInfo['code'])) {
                this.openUpdateModal();
              }
            }
          }
        }
      })
    })
  }

  getCurrentVersion () {
    this.currPlatform = this.getPlatforms();
    return new Promise(resolve => {
      if (this.currPlatform && this.isMobile()) {
        this.appVersion.getVersionNumber().then((version: string) => {
          this.currVersion = version;
          resolve();
        }).catch(err => { })
      } else if (this.webDetectionTest) {
        this.currPlatform = this.simulation;
        this.currVersion = APP_VERSION;
        resolve();
      }
    })
  }

  //获取更新信息
  getUpdateInfo () {
    return new Promise(resolve => {
      this.getCurrentVersion().then(() => {
        if (!this.currVersion) return;
        this.httpService.get(API.GET_APP_TYPE_INFO + "?type=" + this.currPlatform.toUpperCase(), {
          defaultHandleError: false,
          rejectError: false
        }).then(updateInfo => {
          this.updateInfo = updateInfo;
          resolve(updateInfo);
        })
      }).catch(err => { })
    })
  }

  //打开更新弹框
  openUpdateModal () {
    if (this.updateModalShow) return;
    this.updateModalShow = true;
    let updateModal = this.modalCtrl.create(this.updateModal, {
      versionInfo: this.updateInfo,
      platform: this.currPlatform
    }, {
        cssClass: 'update-modal',
        showBackdrop: false,
        enterAnimation: 'modal-alert-enter',
        leaveAnimation: 'modal-alert-leave',
        enableBackdropDismiss: false
      })

    updateModal.onDidDismiss(res => {
      if (res && res.ignore) {
        this.updateModalShow = false;
        //忽略该版本
        this.storage.get(STORAGE_CONSTANT.VERSION_IGNORE).then(versionIgnore => {
          versionIgnore = versionIgnore || {};
          versionIgnore['versionIgnoreCode'] = this.updateInfo['code'];
          versionIgnore['versionIgnoreTime'] = new Date();
          this.storage.set(STORAGE_CONSTANT.VERSION_IGNORE, versionIgnore);
        })
      }
    });

    updateModal.present()
  }

  /**
   * 是否真机环境
   * @return {boolean}
   */
  isMobile (): boolean {
    return this.platform.is('mobile') && !this.platform.is('mobileweb');
  }

  /**
   * 是否android真机环境
   * @return {boolean}
   */
  isAndroid (): boolean {
    return this.isMobile() && this.platform.is('android');
  }

  /**
   * 是否ios真机环境
   * @return {boolean}
   */
  isIos (): boolean {
    return this.isMobile() && (this.platform.is('ios') || this.platform.is('ipad') || this.platform.is('iphone'));
  }

  getPlatforms (): string {
    if (this.isAndroid()) {
      return "android";
    } else if (this.isIos()) {
      return "ios";
    } else {
      return "";
    }
  }

  versionCompare (currVer, promoteVer) {
    currVer = currVer || "0.0.0";
    promoteVer = promoteVer || "0.0.0";
    if (currVer == promoteVer) return false;
    var currVerArr = currVer.split(".");
    var promoteVerArr = promoteVer.split(".");
    var len = Math.max(currVerArr.length, promoteVerArr.length);
    for (var i = 0; i < len; i++) {
      var proVal = ~~promoteVerArr[i],
        curVal = ~~currVerArr[i];
      if (proVal < curVal) {
        return false;
      } else if (proVal > curVal) {
        return true;
      }
    }
    return false;
  }
}