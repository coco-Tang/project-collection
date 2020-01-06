import { Component, ViewChild } from '@angular/core';
import { NavParams, LoadingController, ActionSheetController, Navbar, ModalController, NavController, ToastController, App, Content } from 'ionic-angular';

import { Storage } from '@ionic/storage';
import { STORAGE_CONSTANT } from '../../../../config/storage';
import { FileTransferTool } from '../../../../utils/file-transfer';
import { CertificationMaterialPage } from '../certification-material/certification-material';
import { ProfilePage } from '../../profile/profile';
import { TabsPage } from '../../../tabs/tabs';
import { EnterpriseListPage } from '../enterprise-list';
import { EnterpriseService } from '../enterprise.service';
import { CommonConfirm } from '../../../../components/common-confirm/common-confirm';
import { FormBuilder, Validators } from '@angular/forms';
import { PhotoViewer } from '@ionic-native/photo-viewer';

@Component({
  selector: 'page-enterprise-from',
  templateUrl: 'enterprise-form.html'
})

export class EnterpriseFormPage {
  protocalFileSn = 'CON_PROTOCOL_09';
  enterpriseProtocalFileSn = 'CON_PROTOCOL_05';
  certificationMaterialPush: any = CertificationMaterialPage;
  enterpriseObj: any = {};//企业基本信息
  qualificationList: any = [];// 认证材料
  enterpriseId: string;
  paramObj: any = {};//调用相机与上传图片的参数
  enterpriseForm: any;
  hasProtocalFile: any = true;
  hasCreditFile: any = true;
  creditCodePattern = /^[a-zA-Z0-9]+$/;// 社会信用代码
  phonePattern = /^[0-9\-]+$/;
  emailPattern = /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;//邮箱
  chOrEnPattern = /^[a-zA-Z·\u4e00-\u9fa5]+$/;//中英文
  loadDone: boolean = false;
  requesting: boolean = false;
  status: string;
  disableMoveEvent: boolean = false;
  loadingObj: any;
  @ViewChild(Navbar) navBar: Navbar;
  @ViewChild(Content) content: Content;
  constructor(public app: App, public loadingCtrl: LoadingController, public toastCtrl: ToastController, public formBuilder: FormBuilder, public navCtrl: NavController, public modalCtrl: ModalController, public fileTransferTool: FileTransferTool, public actionSheetCtrl: ActionSheetController, public storage: Storage, public navParams: NavParams, public enterpriseService: EnterpriseService, private photoViewer: PhotoViewer) {
    this.enterpriseId = this.navParams.data['enterpriseId'];
    //修改
    if (this.enterpriseId) {
      this.getEnterpriseInfo();
    } else {
      //新增
      this.initData();
      this.loadDone = true;
    }
  }

  initOnPop = (params) => {
    this.enterpriseObj = params['enterpriseObj'];
    this.qualificationList = params['qualificationList'];
    this.getQualificationNum();
  }

  initForm (data) {
    let { enterpriseName, legalName, registerAddress, creditCode, fax, email, referrer, billingBankName, billingBankAccount, contactTelephone, invoiceAddress } = data;
    this.enterpriseForm = this.formBuilder.group({
      enterpriseName: [enterpriseName || '', [Validators.required]],
      legalName: [legalName || '', [Validators.required, Validators.pattern(this.chOrEnPattern)]],
      registerAddress: [registerAddress || '', [Validators.required]],
      creditCode: [creditCode || '', [Validators.required, Validators.pattern(this.creditCodePattern)]],
      fax: [fax || '', [Validators.pattern(this.phonePattern)]],
      email: [email || '', [Validators.pattern(this.emailPattern)]],
      referrer: [referrer || ''],
      billingBankName: [billingBankName || '', [Validators.required, Validators.pattern(this.chOrEnPattern)]],
      billingBankAccount: [billingBankAccount || '', [Validators.required, Validators.pattern(this.phonePattern)]],
      contactTelephone: [contactTelephone || '', [Validators.required, Validators.pattern(this.phonePattern)]],
      invoiceAddress: [invoiceAddress || '', [Validators.required]]
    })
  }

  ionViewDidLoad () {
    this.navBar.backButtonClick = this.backButtonClick;
  }

  backButtonClick = () => {
    this.disableMoveEvent = true;
    let modal = this.modalCtrl.create(CommonConfirm, {
      message: '是否保存本次编辑内容'
    }, {
        enterAnimation: 'modal-alert-enter',
        leaveAnimation: 'modal-confirm-leave',
      });
    modal.present();
    modal.onDidDismiss(res => {
      this.loadingObj = this.loadingCtrl.create();
      this.disableMoveEvent = false;
      if (res && res.confirm) {
        this.registerConfirm('EDIT');
        this.loadingObj.present();
      } else {
        this.goBack();
      }
    })
  }

  goBack () {
    //如果是提交返回list
    if (this.status === 'WAIT') {
      this.app.getRootNavs()[0].setPages([{
        page: TabsPage,
        params: {
          tabIndex: 2
        }
      }, {
        page: ProfilePage,
      }, {
        page: EnterpriseListPage
      }])
    } else {
      //取消或者编辑返回
      this.navCtrl.pop();
    }
  }

  initData () {
    this.enterpriseObj.enterpriseType = this.enterpriseService.ENTERPRISE_TYPE[0].id;
    this.storage.get(STORAGE_CONSTANT.USER_INFO).then(userInfo => {
      this.enterpriseObj.contactName = userInfo.userName;
    })
    this.storage.get(STORAGE_CONSTANT.USER_MOBILE).then(mobile => {
      this.enterpriseObj.contactMobile = mobile;
    })
    this.initForm({});
  }

  getEnterpriseInfo () {
    this.loadDone = false;
    this.enterpriseService.getEnterpriseInfo(this.enterpriseId).then(res => {
      this.loadDone = true;
      let { qualificationListNum, enterpriseName, legalName, registerAddress, creditCode, fax, email, referrer, enterpriseType, contactName, contactMobile, creditFileId, creditFilePath, enterpriseProtocalFileId, enterpriseProtocalFilePath, enterpriseId } = res;
      this.enterpriseObj = { enterpriseId, qualificationListNum: qualificationListNum, enterpriseType, contactName, contactMobile, creditFileId, creditFilePath, enterpriseProtocalFileId, enterpriseProtocalFilePath };
      res.enterpriseInvoiceInfoVO = res.enterpriseInvoiceInfoVO || {};
      let { billingBankName, billingBankAccount, contactTelephone, invoiceAddress } = res.enterpriseInvoiceInfoVO;
      this.qualificationList = this.navParams.get('certificationList') || res.qualificationList;
      this.getQualificationNum();
      this.initForm({ enterpriseName, legalName, registerAddress, creditCode, fax, email, referrer, enterpriseType, billingBankName, billingBankAccount, contactTelephone, invoiceAddress });
    }).catch(err => {
      this.loadDone = true;
      this.initForm({});
    })
  }

  getQualificationNum () {
    this.enterpriseObj.qualificationListNum = 0;
    this.qualificationList.map(item => {
      if (item.fileId) this.enterpriseObj.qualificationListNum += 1;
    })
  }

  getEnterpriseType (params) {
    this.enterpriseObj.enterpriseType = params.id;
  }

  registerConfirm (status) {
    this.status = status;
    //提交表单  触发验证
    if (status == 'WAIT') {
      this.hasCreditFile = this.enterpriseObj.creditFileId;
      this.hasProtocalFile = this.enterpriseObj.enterpriseProtocalFileId;
      if (this.enterpriseForm.invalid || !this.hasCreditFile || !this.hasProtocalFile) return;
      this.loadingObj = this.loadingCtrl.create();
    }
    //保存草稿 清掉验证有误的数据
    if (status == 'EDIT') {
      for (const key in this.enterpriseForm.controls) {
        if (this.enterpriseForm.controls[key].invalid) {
          this.enterpriseForm.value[key] = '';
        }
      }
    }

    let { enterpriseName, legalName, registerAddress, creditCode, fax, email, referrer, billingBankName, billingBankAccount, contactTelephone, invoiceAddress } = this.enterpriseForm.value;
    if (!referrer && status == 'WAIT') referrer = '无';
    let params = {
      ...this.enterpriseObj,
      protocalFileSn: this.protocalFileSn,
      enterpriseProtocalFileSn: this.enterpriseProtocalFileSn,
      status,
      enterpriseName,
      legalName,
      registerAddress,
      creditCode,
      fax,
      email,
      referrer,
      enterpriseInvoiceInfoVO: { billingBankName, billingBankAccount, contactTelephone, invoiceAddress },
      qualificationList: this.qualificationList
    }
    this.requesting = true;
    this.enterpriseService.postEnterpriseInfo(params).then(res => {
      this.toastCtrl.create({
        message: '提交成功等待审核',
        duration: 1500,
        position: 'middle'
      })
      this.goBack();
      this.requesting = false;
      this.loadingObj && this.loadingObj.dismissAll();
    }).catch(err => { this.requesting = false; this.loadingObj && this.loadingObj.dismissAll(); })
  }

  presentActionSheet (fileType, id, path, hasFile) {
    this.paramObj.fileType = fileType;
    let actionSheet = this.actionSheetCtrl.create({
      buttons: [
        {
          text: '拍照',
          handler: () => {
            this.paramObj['sourceType'] = this.fileTransferTool.pictureSourceType.CAMERA;
            this.uploadImage(id, path, hasFile);
          }
        },
        {
          text: '我的相册',
          handler: () => {
            this.paramObj['sourceType'] = this.fileTransferTool.pictureSourceType.PHOTOLIBRARY;
            this.uploadImage(id, path, hasFile);
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

  uploadImage (id, path, hasFile) {
    this.fileTransferTool.uploadImage(this.paramObj).then(data => {
      this.enterpriseObj[id] = data['fileId'];
      this.enterpriseObj[path] = data['filePath'];
      this[hasFile] = true;
    })
  }

  clearUpload (id, path, hasFile) {
    this.enterpriseObj[id] = '';
    this.enterpriseObj[path] = '';
    this[hasFile] = false;
  }

  showImg (url) {
    this.photoViewer.show(url, '', { share: false });
  }
}