import { Storage } from '@ionic/storage';
import { Injectable } from '@angular/core';
import { RequestOptions } from '@angular/http';

import { API } from '../config/api';
import { STORAGE_CONSTANT } from '../config/storage';

import { HttpService } from '../services/http.service';
import { App } from 'ionic-angular';
import { LoginPage } from '../pages/auth/login/login';
import { Helper } from '../utils/helper';

@Injectable()
export class AuthService {

  private hasLogin = false;

  constructor(private requestOptions: RequestOptions, private httpService: HttpService, public storage: Storage, private app: App, private helper: Helper) {

    this.storage.get(STORAGE_CONSTANT.TOKEN).then(token => {
      if (token) this.requestOptions.headers.set('token', token);
    })

    this.storage.get(STORAGE_CONSTANT.USER_ID).then(uid => {
      if (uid) this.requestOptions.headers.set('uid', uid);
    })

  }

  // 密码登陆
  loginByPassword (user) {
    return new Promise((resolve, reject) => {
      this.httpService.post(API.LOGIN_BY_PASSWORD, {
        account: user.account,
        password: user.password
      }).then(res => {
        this.authentication(res);
        this.updateUserInStorage();
        resolve(res)
      })
        .catch(error => {
          reject(error)
        })
    })
  }

  // 验证码登陆
  loginBySmsCode (user) {
    return new Promise((resolve, reject) => {
      this.httpService.post(API.LOGIN_BY_CODE, {
        mobile: user.account,
        smsCode: user.smsCode
      }).then(res => {
        this.authentication(res);
        this.updateUserInStorage();
        resolve(res)
      })
        .catch(error => {
          reject(error)
        })
    })
  }

  // 发送验证码
  sendSmsCode (user) {
    return this.httpService.get(API.GET_NOTE_VERIFY + '?mobile=' + user.account, {
      defaultHandleError: true,
      rejectError: false
    })
  }

  authentication (user) {
    this.hasLogin = true;
    this.storage.set(STORAGE_CONSTANT.HAS_LOGGED_IN, true);
    this.storage.set(STORAGE_CONSTANT.TOKEN, user.token);
    this.storage.set(STORAGE_CONSTANT.USER_ID, user.uid);

    //设置请求头中的认证信息
    this.requestOptions.headers.set('token', user.token);
    this.requestOptions.headers.set('uid', user.uid);
  }

  //获取用户信息,并存在storage中
  updateUserInStorage () {
    this.httpService.get(API.GET_USER_INFO).then(user => {
      this.storage.set(STORAGE_CONSTANT.LATEST_LOGIN_MOBILE, user.telephone);
      this.storage.set(STORAGE_CONSTANT.USER_INFO, user);
    })
  }

  // 从storage中获取用户信息
  getUserInfoFromStorage () {
    return new Promise(resolve => {
      this.storage.get(STORAGE_CONSTANT.USER_INFO).then(userInfo => {
        resolve(userInfo || {})
      })
    })
  }

  logout (withoutRequest?) {
    this.hasLogin = false;
    this.storage.set(STORAGE_CONSTANT.HAS_LOGGED_IN, false);
    this.storage.remove(STORAGE_CONSTANT.USER_ID);
    this.storage.remove(STORAGE_CONSTANT.TOKEN);

    withoutRequest ? this.app.getRootNav().setRoot(LoginPage) : this.httpService.post(API.LOGOUT, {
      defaultHandleError: true,
      rejectError: true
    });
  }

  isLogin () {
    return this.hasLogin;
  }

  hasLoggedIn () {
    let self = this;
    return this.storage.get(STORAGE_CONSTANT.HAS_LOGGED_IN).then((value) => {
      self.hasLogin = value ? true : false;
      return self.hasLogin;
    });
  }

  getAccountInfo (params?) {
    return this.httpService.get(this.helper.URL.getUrl(API.GET_ACCOUNT_INFO, params), {
      defaultHandleError: false
    })
  }
}
