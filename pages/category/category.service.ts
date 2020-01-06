import { Injectable } from '@angular/core';

import { API } from '../../config/api';

import { HttpService } from '../../services/http.service';


@Injectable()
export class CategoryService {

  constructor(private httpService: HttpService) {

  }

  getGoodsCategoryTree (params) {
    return this.httpService.post(API.GET_GOODS_CATEGORY_TREE, params, {
      defaultHandleError: true,
      rejectError: false
    })
  }

  getFollowList (params) {
    return this.httpService.post(API.GET_FOLLOWED_LIST, params, {
      defaultHandleError: true,
      rejectError: false
    });
  }

}

