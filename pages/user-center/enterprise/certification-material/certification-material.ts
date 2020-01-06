import { Component, ViewChild } from '@angular/core';
import { ActionSheetController, NavParams, NavController, Navbar } from 'ionic-angular';
import { FileTransferTool } from '../../../../utils/file-transfer';
import { EnterpriseService } from '../enterprise.service';

@Component({
  selector: "page-certification-material",
  templateUrl: "certification-material.html"
})
export class CertificationMaterialPage {
  certificationList: any = [];
  enterpriseId: any;
  paramObj: any = {
    fileType: this.enterpriseService.FILE_TYPE.entQua,
  }
  navData: any;
  currentObj: any;
  callback: any;
  @ViewChild(Navbar) navBar: Navbar;
  constructor(public navCtrl: NavController, public navParams: NavParams, public fileTransferTool: FileTransferTool, public enterpriseService: EnterpriseService, public actionSheetCtrl: ActionSheetController) {
    this.navData = this.navParams.data;
    this.callback = this.navParams.data['callback'];
    this.getCertificationList();
  }

  getCertificationList () {
    this.enterpriseService.getEnterpriseInfo('').then(res => {
      this.certificationList = res.qualificationList || [];
      let certificationListParam = this.navData['qualificationList'] || [];
      this.certificationList.map(certification => {
        certificationListParam.map(item => {
          if (certification.qualificationTypeCode == item.qualificationTypeCode) {
            certification['filePath'] = item['filePath'];
            certification['fileId'] = item['fileId'];
          }
        })
      })
    }).catch(err => { })
  }

  presentActionSheet (certification) {
    this.currentObj = certification;
    let actionSheet = this.actionSheetCtrl.create({
      buttons: [
        {
          text: '拍照',
          handler: () => {
            this.paramObj['sourceType'] = this.fileTransferTool.pictureSourceType.CAMERA;
            this.uploadImage();
          }
        },
        {
          text: '我的相册',
          handler: () => {
            this.paramObj['sourceType'] = this.fileTransferTool.pictureSourceType.PHOTOLIBRARY;
            this.uploadImage();
          }
        },
        {
          text: '取消',
          role: 'cancel',
          handler: () => { }
        }
      ]
    });
    actionSheet.present();
  }

  uploadImage () {
    this.fileTransferTool.uploadImage(this.paramObj).then(data => {
      this.certificationList.map(item => {
        if (this.currentObj.qualificationTypeCode == item.qualificationTypeCode) {
          item['filePath'] = data['filePath'];
          item['fileId'] = data['fileId'];
        }
      })
    })
  }

  saveConfirm () {
    this.navData.qualificationList = this.certificationList;
    this.goBack();
  }


  ionViewDidLoad () {
    this.navBar.backButtonClick = this.backButtonClick;
  }

  backButtonClick = () => {
    this.goBack();
  }

  goBack () {
    this.navCtrl.pop().then(() => {
      this.callback(this.navData)
    })
  }
}