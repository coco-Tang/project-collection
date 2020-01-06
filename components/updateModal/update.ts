import { Component } from "@angular/core";
import { Platform, ViewController, NavParams, ModalController } from "ionic-angular";
import { InAppBrowser } from '@ionic-native/in-app-browser';

import { DownloadModal } from './download';

@Component({
  selector: 'update-modal',
  templateUrl: "update-modal.html"
})

export class UpdateModal {

  body: Element;
  versionInfo: object;
  currPlatform: string;
  registerFunCallback: Function;
  modaltext: any;
  updateText: string = '更新';

  constructor(public platform: Platform, public viewCtrl: ViewController, private navParams: NavParams, private modalCtrl: ModalController, private inAppBrowser: InAppBrowser) {
    this.body = document.getElementsByTagName("body")[0];
    //禁止滚动事件
    this.body.addEventListener('touchmove', this.preventEvent)

    this.versionInfo = this.navParams.get("versionInfo");
    this.currPlatform = this.navParams.get("platform");

    if (!this.versionInfo) {
      this.viewCtrl.dismiss()
      return;
    }
    if (!this.currPlatform) {
      this.viewCtrl.dismiss()
      return;
    }
    if (this.versionInfo['isForceUpdate'] === "Y") {
      this.updateText = "升级到新版本";
      this.registerFunCallback = this.platform.registerBackButtonAction(() => { }, 10);
    } else {
      this.updateText = "更新";
    }
  }

  /**
   * 下载安装app
   */
  download () {
    if (this.currPlatform == 'ios') {
      this.inAppBrowser.create(this.versionInfo['url'], '_system');
    } else if (this.currPlatform == 'android') {
      this.viewCtrl.dismiss();
      this.modalCtrl.create(DownloadModal, {
        updateInfo: this.versionInfo
      }, {
          cssClass: 'download-modal',
          showBackdrop: false,
          enterAnimation: 'modal-alert-enter',
          leaveAnimation: 'modal-alert-leave',
          enableBackdropDismiss: false
        }).present()
    }
  }

  preventEvent (e) {
    e.preventDefault();
  }

  dismiss () {
    this.body.removeEventListener('touchmove', this.preventEvent);
    this.viewCtrl.dismiss({
      ignore: true
    });
  }

  ngOnDestroy () {
    this.body.removeEventListener('touchmove', this.preventEvent);
    if (this.registerFunCallback) this.registerFunCallback();
  }
}
