import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';

@Component({
  selector: 'page-common-confirm',
  templateUrl: 'common-confirm.html'
})
export class CommonConfirm {

  title: string;
  message: string;
  constructor(public navCtrl: NavController, private navParams: NavParams, public viewCtrl: ViewController) {
    this.message = this.navParams.get("message");
  }

  // 确定
  confirm () {
    this.viewCtrl.dismiss({ confirm: true });
  }

  cancel () {
    this.viewCtrl.dismiss();
  }

}
