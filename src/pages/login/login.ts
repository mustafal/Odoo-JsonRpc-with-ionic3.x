import { HomePage } from '../home/home';
import { OdooJsonRpc } from '../../services/odoojsonrpc';
import { Component } from '@angular/core';
import { AlertController, IonicPage, Loading, LoadingController, NavController, NavParams } from 'ionic-angular';
import { Utils } from "../../services/utils";

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  private listForProtocol: Array<{
    protocol: string
  }> = []
  public perfectUrl: boolean = false
  public odooUrl
  public selectedProtocol
  private dbList: Array<{
    dbName: string
  }> = []
  private selectedDatabase
  private email
  private password

  constructor(public navCtrl: NavController,
    private alert: AlertController, public navParams: NavParams,
    private odooRpc: OdooJsonRpc, private loadingCtrl: LoadingController,
    private utils: Utils) {

    this.listForProtocol.push({
      protocol: "http"
    })
    this.listForProtocol.push({
      protocol: "https"
    })
  }

  public checkUrl() {
    this.utils.presentLoading("Please Wait")
    this.odooRpc.init({
      odoo_server: this.selectedProtocol + "://" + this.odooUrl,
      http_auth: 'username:password' // optional
    })

    this.odooRpc.getDbList().then((dbList: any) => {
      this.perfectUrl = true
      this.utils.dismissLoading()
      this.fillData(dbList)
    }).catch((err: any) => {
      this.utils.presentAlert("Error", "You Entered a wrong Odoo URL",[{
        text:"Ok"
      }])
      this.utils.dismissLoading()
    });

  }

  public fillData(res: any) {
    let body = JSON.parse(res._body)
    let json = body['result'];
    this.dbList.length = 0;
    for (var key in json) {
      this.dbList.push({ dbName: json[key] });
    }
  }

  private login() {
    this.utils.presentLoading("Please wait",0,true)
    this.odooRpc.login(this.selectedDatabase, this.email, this.password)
      .then((res: any) => {
        let logiData: any = JSON.parse(res._body)["result"];
        logiData.password = this.password
        localStorage.setItem("token", JSON.stringify(logiData));
        this.navCtrl.setRoot(HomePage);
      }).catch((err) => {
        this.utils.presentAlert("Error", "Username or password must be incorrect",[{
          text:"Ok"
        }])
        
      });
  }
}
