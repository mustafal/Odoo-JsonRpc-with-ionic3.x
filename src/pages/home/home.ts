import { AddCustomerPage } from '../add-customer/add-customer';
import { Utils } from '../../services/utils';
import { ViewPage } from '../view/view';
import { OdooJsonRpc } from '../../services/odoojsonrpc';
import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { Network } from '@ionic-native/network';
import { ProfilePage } from '../profile/profile';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {

  // splash = true;

  private partnerArray: Array<{
    id: number
    imageUrl: string,
    name: string,
    email: string
  }> = []

  private items: Array<{
    id: number
    imageUrl: string,
    name: string,
    email: string
  }> = []

  private partner = "res.partner";
  private fields = ["image_small", "name", "email"];
  private domain = []
  private sort = ""
  private limit = 0
  private offset = 0

  constructor(private navCtrl: NavController,
    private odooRpc: OdooJsonRpc,
    private alertCtrl: AlertController,
    private network: Network,
    private alert: AlertController,
    private utils: Utils) { }

  ionViewDidLoad() {
    this.display()
  }

  private display(): void {

    this.odooRpc.searchRead(this.partner,
      this.domain, this.fields, this.limit, this.offset,
      this.sort).then((partner: any) => {
        this.fillParners(partner)
      })
  }

  private fillParners(partners: any): void {

    let json = JSON.parse(partners._body);
    if (!json.error) {
      let query = json["result"].records
      for (let i in query) {
        this.partnerArray.push({
          id: query[i].id,
          imageUrl: "data:image/*;base64," + query[i].image_small,
          name: query[i].name == false ? "N/A" : query[i].name,
          email: query[i].email == false ? "N/A" : query[i].email
        })
        this.items.push({
          id: json[i].id,
          imageUrl: "data:image/*;base64," + query[i].image_small,
          name: query[i].name == false ? "N/A" : query[i].name,
          email: query[i].email == false ? "N/A" : query[i].email
        })
      }
    }
  }

  private view(idx: number): void {
    let params = {
      "id": this.partnerArray[idx].id
    }
    this.navCtrl.push(ViewPage, params)
  }

  initializeItems(): void {
    this.partnerArray = this.items;
  }

  getItems(searchbar) {
    // Reset items back to all of the items
    this.initializeItems();

    // set q to the value of the searchbar
    var q = searchbar.srcElement.value;

    // if the value is an empty string don't filter the items
    if (!q) {
      return;
    }

    this.partnerArray = this.partnerArray.filter((v) => {
      if (v.name && q) {
        if (v.name.toLowerCase().indexOf(q.toLowerCase()) > -1) {
          return true;
        }
        return false;
      }
    });

    console.log(q, this.items.length);

  }


  private delete(idx: number) {
    this.odooRpc.deleteRecord(this.partner, this.partnerArray[idx].id)
    this.utils.presentToast(this.partnerArray[idx].name + " Deleted Successfully", 2000, true, "top")
    this.partnerArray.splice(idx, 1)
  }

  viewProfile(): void {
    this.navCtrl.push(ProfilePage)
  }

  addCustomer(): void {
    this.navCtrl.push(AddCustomerPage)
  }

}
