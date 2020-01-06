import { Component, ViewChild } from '@angular/core';
import { NavController, Refresher } from 'ionic-angular';

// import { CategoryService } from '../category/category.service';

@Component({
  selector: 'page-address-form',
  templateUrl: 'address-form.html'
})
export class AddressFormPage {
  @ViewChild(Refresher) refresher: Refresher;
  categoryList: any;

  AddressListPage: any;

  constructor(public navCtrl: NavController) {

  }



}
