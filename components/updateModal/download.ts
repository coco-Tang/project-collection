import { Component } from "@angular/core";
import { Platform, ViewController, NavParams } from "ionic-angular";

import { File } from '@ionic-native/file';
import { FileOpener } from '@ionic-native/file-opener';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';

@Component({
  selector: 'download-modal',
  templateUrl: "download-modal.html"
})

export class DownloadModal {

  body: Element;
  updateInfo: object;

  downloadDone: boolean;
  registerFunCallback: Function;

  apk: string;

  constructor(public platform: Platform, public viewCtrl: ViewController, private navParams: NavParams, private fileOpener: FileOpener, private transfer: FileTransfer, private file: File) {
    this.body = document.getElementsByTagName("body")[0];
    //禁止滚动事件
    this.body.addEventListener('touchmove', this.preventEvent);

    this.updateInfo = this.navParams.get("updateInfo");
    this.download();

    this.registerFunCallback = this.platform.registerBackButtonAction(() => { }, 11);

  }

  download () {
    const fileTransfer: FileTransferObject = this.transfer.create();
    this.apk = this.file.externalDataDirectory + 'android.apk'; //apk保存的目录
    fileTransfer.download(this.updateInfo['url'], this.apk).then(() => {
      let title = document.getElementsByClassName('update-process-title')[0];
      title && (title.innerHTML = '下载完成');
      setTimeout(() => {
        this.downloadDone = true;
        this.install();
      }, 200);
    }).catch(e => {
      console.log(e)
    })

    fileTransfer.onProgress((event: ProgressEvent) => {
      let num = Math.floor(event.loaded / event.total * 100);
      let title = document.getElementsByClassName('update-process-title')[0];
      let bar = document.getElementsByClassName('update-process-bar')[0];
      title && (title.innerHTML = '已下载：' + num + '%');
      bar && (bar['style'].width = num + "%")
    });
  }

  install () {
    this.fileOpener.open(this.apk.replace('file://', ''), 'application/vnd.android.package-archive')
      .then(res => console.log('New apk install success'))
      .catch(e => console.log(e));
  }

  preventEvent (e) {
    e.preventDefault();
  }

  dismiss () {
    this.body.removeEventListener('touchmove', this.preventEvent);
    this.viewCtrl.dismiss();
  }

  ngOnDestroy () {
    if (this.registerFunCallback) this.registerFunCallback();
    this.body.removeEventListener('touchmove', this.preventEvent);
  }
}
