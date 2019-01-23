import { HomePage } from "../pages/home/home";
import { LoginPage } from "../pages/login/login";
import { OdooJsonRpc } from "../services/odoojsonrpc";
import { Component } from "@angular/core";
import { AlertController, Platform } from "ionic-angular";
import { StatusBar } from "@ionic-native/status-bar";
import { Network } from "@ionic-native/network";
import { SplashScreen } from "@ionic-native/splash-screen";
import { Utils } from "../services/utils";

@Component({
  templateUrl: "app.html",
  providers: [OdooJsonRpc, Utils]
})
export class MyApp {
  rootPage: any = LoginPage;
  constructor(
    platform: Platform,
    private statusBar: StatusBar,
    splashScreen: SplashScreen,
    public odooRpc: OdooJsonRpc,
    public alert: AlertController,
    private network: Network
  ) {
    platform.ready().then(() => {
      splashScreen.hide();
      // let status bar overlay webview
      this.statusBar.overlaysWebView(false);

      // set status bar to color
      this.statusBar.backgroundColorByHexString("#3ebffb");
    });

    if (localStorage.getItem("token")) {
      let response = localStorage.getItem("token");

      let jsonData = JSON.parse(response);
      let username = jsonData["username"];
      let pass = jsonData["password"];
      let url = jsonData["web.base.url"];
      let db = jsonData["db"];

      this.odooRpc.init({
        odoo_server: url,
        http_auth: "username:password"
      });
      this.odooRpc.login(db, username, pass).catch((error: any) => {
        let alrt = this.alert.create({
          title: "Server Status",
          message: "The connection to " + url + " is refused!!",
          buttons: ["Ok"]
        });
        alrt.present();
      });
      this.rootPage = HomePage;
    }
  }
}
