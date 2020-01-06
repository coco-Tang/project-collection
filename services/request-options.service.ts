import { Storage } from '@ionic/storage';
import { Injectable } from '@angular/core';
import { BaseRequestOptions } from '@angular/http';

import { STORAGE_CONSTANT } from '../config/storage';

@Injectable()
export class DefaultRequestOptions extends BaseRequestOptions {

  constructor(private storage: Storage) {
    super();

    this.storage.get(STORAGE_CONSTANT.TOKEN).then(token => {
      if (token) this.headers.set('token', token);
    })

    this.storage.get(STORAGE_CONSTANT.USER_ID).then(uid => {
      if (uid) this.headers.set('uid', uid);
    })

    this.withCredentials = true;
  }

}
