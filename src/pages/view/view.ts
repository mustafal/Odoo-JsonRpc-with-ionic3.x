import { OdooJsonRpc } from "../../services/odoojsonrpc";
import { Component } from "@angular/core";
import { NavController, NavParams } from "ionic-angular";
import { Utils } from "../../services/utils";

@Component({
  selector: "page-view",
  templateUrl: "view.html"
})
export class ViewPage {
  private partnerId: number;
  public imageSrc: string;
  private isMember: boolean;
  private name: string;
  private email: string;

  public data: Array<{
    id: number;
    name: string;
    email: string;
    mobile: any;
    phone: any;
    title: number;
    street: string;
    street2: string;
    city: string;
    state_id: number;
    country_id: number;
    zip: number;
    website: any;
    function: string;
  }> = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public odooRpc: OdooJsonRpc,
    public utils: Utils
  ) {
    this.partnerId = navParams.get("id");
    this.display();
  }

  private display(): void {
    let partner = "res.partner";
    let fields = [
      "name",
      "email",
      "mobile",
      "phone",
      "title",
      "street",
      "street2",
      "city",
      "state_id",
      "function",
      "country_id",
      "zip",
      "website",
      "image"
    ];
    let domain = [["id", "=", this.partnerId]];
    let sort = "";
    let limit = 0;
    let offset = 0;
    this.odooRpc
      .searchRead(partner, domain, fields, limit, offset, sort)
      .then((res: any) => {
        let data = JSON.parse(res._body)["result"].records;
        for (let record in data) {
          this.imageSrc = data[record].image;
          this.name = data[record].name == false ? "N/A" : data[record].name;
          this.email = data[record].email == false ? "N/A" : data[record].email;
          this.data.push({
            id: data[record].id,
            name: data[record].name,
            email: data[record].email == false ? "N/A" : data[record].email,
            mobile: data[record].mobile == false ? "N/A" : data[record].mobile,
            phone: data[record].phone == false ? "N/A" : data[record].phone,
            title: data[record].title == false ? "N/A" : data[record].title[1],
            street: data[record].street == false ? "" : data[record].street,
            street2: data[record].street2 == false ? "" : data[record].street2,
            city: data[record].city == false ? "" : data[record].city,
            state_id:
              data[record].state_id == false ? "" : data[record].state_id,
            country_id:
              data[record].country_id == false ? "" : data[record].country_id,
            zip: data[record].zip == false ? "" : data[record].zip,
            website:
              data[record].website == false ? "N/A" : data[record].website,
            function:
              data[record].function == false ? "N/A" : data[record].function
          });
        }
      });
  }
}
