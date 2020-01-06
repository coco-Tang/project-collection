import { Injectable } from "@angular/core";

import { LoadingController, Platform, ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { File } from '@ionic-native/file';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { FilePath } from '@ionic-native/file-path';
import { Crop } from '@ionic-native/crop';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';


import { API } from '../config/api';
import { STORAGE_CONSTANT } from '../config/storage';

@Injectable()
export class FileTransferTool {
  token: any;
  pictureSourceType: any;
  billion = 1048576;
  constructor(public filePath: FilePath, public crop: Crop, public camera: Camera, public storage: Storage, public transfer: FileTransfer, public loadingCtrl: LoadingController, public platform: Platform, public toastCtrl: ToastController, privatefileTransfer: FileTransfer, private file: File) {
    this.pictureSourceType = this.camera.PictureSourceType;
  }

  uploadImage (paramObj) {
    this.storage.get(STORAGE_CONSTANT.TOKEN).then(data => {
      this.token = data;
    });
    return new Promise((resolve, reject) => {
      this.getPicture(paramObj.sourceType).then(filePath => {
        this.doUploadImage(filePath, paramObj.fileType).then(res => {
          let data = JSON.parse(res['response']).data
          resolve(data);
        }).then(err => { })
      })
    })
  }

  //调用相机或相册获取图片
  getPicture (sourceType) {
    // Create options for the Camera Dialog
    const options: CameraOptions = {
      sourceType: sourceType,
      targetWidth: 1000,
      cameraDirection: 0//默认摄像头方向
    };

    // Get the data of an image
    return new Promise((resolve, reject) => {
      // Get the data of an image
      this.camera.getPicture(options).then((imagePath) => {
        // Special handling for Android library
        if (this.platform.is('android') && sourceType === this.camera.PictureSourceType.PHOTOLIBRARY) {
          let correctPath = 'file://' + imagePath;
          this.checkImg(correctPath).then(() => {
            resolve(correctPath);
          })
        } else {
          this.checkImg(imagePath).then(() => {
            resolve(imagePath);
          })
        }
      }, (err) => {
        // this.presentToast('Error while selecting image.');
      });
    })
  }

  checkImg (filePath) {
    return new Promise((resolve, reject) => {
      let endIndex = filePath.lastIndexOf(".") + 1;
      let extend = filePath.substring(endIndex);
      if (extend !== 'jpg' && extend !== 'jpeg' && extend !== 'png' && extend !== 'bmp') {
        this.presentToast("请上传jpg、jpeg、png、bmp格式，大小不超过10M的图片");
        reject();
        return;
      }

      this.file.resolveLocalFilesystemUrl(filePath).then(entry => {
        entry.getMetadata(
          metadata => {
            if (metadata.size > this.billion * 10) {
              this.presentToast("图片大小不能超过10M");
              reject();
            } else {
              resolve();
            }
          },
          error => { }
        );
      });
    })

  }

  // this.crop.crop('path/to/image.jpg', {quality: 75})
  // .then(
  //   newImage => console.log('new image path is: ' + newImage),
  //   error => console.error('Error cropping image', error)
  // );

  //上传图片
  public doUploadImage (filePath, fileType) {
    let options: FileUploadOptions = {
      fileKey: "picFile",
      chunkedMode: false,
      mimeType: "multipart/form-data",
      params: {
        fileType: fileType
      },
      headers: {
        token: this.token
      }
    }
    const fileTransfer: FileTransferObject = this.transfer.create();

    let loading = this.loadingCtrl.create({
      content: '上传中...',
    });
    loading.present();

    return new Promise((resolve, reject) => {
      // Use the FileTransfer to upload the image
      fileTransfer.upload(filePath, API.UPLOAD_FILE, options).then(data => {
        resolve(data);
        loading.dismissAll();
        this.presentToast('上传成功');
      }, err => {
        loading.dismissAll();
        if (err.msg) {
          this.presentToast(err.msg);
        } else {
          this.presentToast('上传失败，请稍后重试..');
        }
      });
    })
  }

  private presentToast (text) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 1500,
      position: 'middle'
    });
    toast.present();
  }

}