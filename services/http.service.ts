import { Injectable } from '@angular/core';
import { Http, Response } from "@angular/http";
import { Events, ToastController } from "ionic-angular";
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/timeoutWith';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/delay';

@Injectable()
export class HttpService {

  private TIME_OUT = 5000;
  private ERROR_CONFIG = {};

  constructor(private http: Http, private events: Events, public toastCtrl: ToastController) {
    this.ERROR_CONFIG = {
      defaultHandleError: true,
      rejectError: true
    }
  }

  request (url, config = this.ERROR_CONFIG) {
    return this.http.request(url).timeoutWith(this.TIME_OUT, Observable.throw(new Error('Timeout!')))
      .toPromise()
      .then(response => this.extractData(response))
      .catch(response => this.handleError(response, config))
  }

  get (url, config = this.ERROR_CONFIG) {
    return this.http.get(url).timeoutWith(this.TIME_OUT, Observable.throw(new Error('Timeout!')))
      .toPromise()
      .then(response => this.extractData(response))
      .catch(response => this.handleError(response, config))
  }

  post (url, params, config = this.ERROR_CONFIG) {
    return this.http.post(url, params).timeoutWith(this.TIME_OUT, Observable.throw(new Error('Timeout!')))
      .toPromise()
      .then(response => this.extractData(response))
      .catch(response => this.handleError(response, config))
  }

  put (url, params, config = this.ERROR_CONFIG) {
    return this.http.put(url, params).timeoutWith(this.TIME_OUT, Observable.throw(new Error('Timeout!')))
      .toPromise()
      .then(response => this.extractData(response))
      .catch(response => this.handleError(response, config))
  }

  delete (url, config = this.ERROR_CONFIG) {
    return this.http.delete(url).timeoutWith(this.TIME_OUT, Observable.throw(new Error('Timeout!')))
      .toPromise()
      .then(response => this.extractData(response))
      .catch(response => this.handleError(response, config))
  }

  patch (url, params, config = this.ERROR_CONFIG) {
    return this.http.patch(url, params).timeoutWith(this.TIME_OUT, Observable.throw(new Error('Timeout!')))
      .toPromise()
      .then(response => this.extractData(response))
      .catch(response => this.handleError(response, config))
  }

  head (url, config = this.ERROR_CONFIG) {
    return this.http.head(url).timeoutWith(this.TIME_OUT, Observable.throw(new Error('Timeout!')))
      .toPromise()
      .then(response => this.extractData(response))
      .catch(response => this.handleError(response, config))
  }

  options (url, config = this.ERROR_CONFIG) {
    return this.http.options(url).timeoutWith(this.TIME_OUT, Observable.throw(new Error('Timeout!')))
      .toPromise()
      .then(response => this.extractData(response))
      .catch(response => this.handleError(response, config))
  }

  private extractData (res: Response) {
    let body = res.json();
    if (body.success == 1) {
      return body.data || {};
    } else {
      return Promise.reject(res)
    }
  }

  private handleError (error: Response | any, config: object) {
    let errMsg: string;
    let toastMsg: string;
    if (error instanceof Response) {
      let body;
      try {
        body = error.json() || '';
      } catch (e) {
        body = '';
      }
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
      toastMsg = error.status == 401 ? '账号/密码已过期，请重新登录' : err.msg
    } else {
      errMsg = error.message ? error.message : error.toString();
    }

    //是否需要默认错误处理
    if (config['defaultHandleError']) {
      this.toastCtrl.create({
        message: toastMsg || '网络开小差了～',
        duration: 1200,
        position: 'middle',
        dismissOnPageChange: true
      }).present()
    }

    if (error.status == 401) {
      setTimeout(() => {
        this.events.publish("user:logout");
      }, 1000)
    }

    //是否还需要将错误消息reject出去
    if (config['rejectError']) {
      return Promise.reject(errMsg);
    }
  }

}
