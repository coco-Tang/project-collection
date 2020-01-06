import { Component } from '@angular/core';
import { Events, ViewController, NavController, NavParams } from "ionic-angular";
import { EnquiryService } from '../../pages/enquiry/enquiry.service';
@Component({
  selector: "update-count-modal",
  templateUrl: "update-count-modal.html"
})
export class UpdateCountModal {
  navData: any;
  requesting: boolean = false;
  constructor(public events: Events, public enquiryService: EnquiryService, public viewCtrl: ViewController, public navCtrl: NavController, private navParams: NavParams) {

    this.navData = this.navParams.data;
  }

  gotoAjustList () {
    this.viewCtrl.dismiss(this.navData);
  }

  confirm () {
    let { enquiryId, price, quantity, enterpriseId } = this.navData;
    this.requesting = true;
    this.enquiryService.sellerOperation({ enquiryId, price, quantity, enterpriseId }).then(res => {
      this.requesting = false;
      this.viewCtrl.dismiss({
        adjustSuccess: true
      });
    }).catch(err => {
      this.requesting = false;
    })
  }

}