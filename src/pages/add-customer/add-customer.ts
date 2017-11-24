import { OdooJsonRpc } from '../../services/odoojsonrpc';
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Utils } from '../../services/utils';

@Component({
  selector: 'page-add-customer',
  templateUrl: 'add-customer.html',
})
export class AddCustomerPage {

  private name
  private mobile
  private phone
  private email
  private website

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private odooRpc: OdooJsonRpc,
    private utils:Utils) { }


  saveData(): void {
    
    let model = "res.partner";
    let params = {
      name:this.name,
      email:this.email,
      mobile:this.mobile,
      phone:this.phone,
      website:this.website
    }

    this.odooRpc.createRecord(model,params).then((res:any)=>{
      this.utils.presentToast("User added successfully",1000,false,'top')
      this.navCtrl.pop()
    }).catch((err:any)=>{
      alert(err)
    })
  }
}
