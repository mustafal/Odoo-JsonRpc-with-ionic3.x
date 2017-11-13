import { identifierModuleUrl } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
import 'rxjs/Rx';
import 'rxjs/add/operator/toPromise';

export class OdooJsonRpc {

    private jsonRpcID: number = 0;
    private headers: Headers;
    private odoo_server: string;
    private http_auth: string;
    private list = "/web/database/list";

    constructor(private http: Http) {
        this.http = http;
    }

    private buildRequest(url: String, params: any) {
        this.jsonRpcID += 1;
        return JSON.stringify({
            jsonrpc: "2.0",
            method: "call",
            id: this.jsonRpcID,
            params: params,
        });
    }

    private handleOdooErrors(response: any) {
        response = response.json();
        if (!response.error) {
            return response.result;
        }

        let error = response.error;
        let errorObj = {
            title: "    ",
            message: "",
            fullTrace: error
        };

        if (error.code === 200 && error.message === "Odoo Server Error" && error.data.name === "werkzeug.exceptions.NotFound") {
            errorObj.title = "page_not_found";
            errorObj.message = "HTTP Error";
        } else if ((error.code === 100 && error.message === "Odoo Session Expired") || // v8
            (error.code === 300 && error.message === "OpenERP WebClient Error" && error.data.debug.match("SessionExpiredException")) // v7
        ) {
            errorObj.title = "session_expired";

        } else if ((error.message === "Odoo Server Error" && /FATAL:  database "(.+)" does not exist/.test(error.data.message))) {
            errorObj.title = "database_not_found";
            errorObj.message = error.data.message;
        } else if ((error.data.name === "openerp.exceptions.AccessError")) {
            errorObj.title = "AccessError";
            errorObj.message = error.data.message;
        } else {
            let split = ("" + error.data.fault_code).split("\n")[0].split(" -- ");
            if (split.length > 1) {
                error.type = split.shift();
                error.data.fault_code = error.data.fault_code.substr(error.type.length + 4);
            }

            if (error.code === 200 && error.type) {
                errorObj.title = error.type;
                errorObj.message = error.data.fault_code.replace(/\n/g, "<br />");
            } else {
                errorObj.title = error.message;
                errorObj.message = error.data.debug.replace(/\n/g, "<br />");
            }
        }
        return Promise.reject(errorObj);
    }

    private handleHttpErrors(error: any) {
        return Promise.reject(error.message || error);
    }

    public sendRequest(url: string, params: Object): Promise<any> {
        let options = this.buildRequest(url, params);
        this.headers = new Headers({
            'Content-Type': 'application/json; charset=utf-8',
        });

        let result = this.http.post(this.odoo_server + url, options, { headers: this.headers })
            .toPromise()
            .catch(err => this.handleHttpErrors(err));

        return result;
    }

    public init(configs: any) {
        this.odoo_server = configs.odoo_server;
        this.http_auth = configs.http_auth || null;
    }

    public setOdooServer(odoo_server: string) {
        this.odoo_server = odoo_server;
    }

    public setHttpAuth(http_auth: string) {
        this.http_auth = http_auth;
    }

    public getServerInfo() {
        return this.sendRequest("/web/webclient/version_info", {});
    }

    public getSessionInfo() {
        return this.sendRequest("/web/session/get_session_info", {});
    }

    public getDbList() { // only use for odoo >= 10.0
        let dbParams = {
            context: {}
        }
        return this.sendRequest(this.list, dbParams);
    }

    public login(db: string, login: string, password: string) {
        let params = {
            db: db,
            login: login,
            password: password,
            base_location: this.odoo_server,
            context: {}
        };
        let res = this.sendRequest("/web/session/authenticate", params);
        return res;
    }

    public isLoggedIn():boolean {
        if(localStorage.getItem('token')){
            return true;
        }else{
            return false;
        }
    }

    public searchRead(model: string, domain: any, fields: any, limit: number,offset:any,sort:string) {
        let params = {
            model: model,
            fields: fields,
            domain: domain,
            offset:offset,
            limit: limit,
            sort:sort,
            context: this.getContext()
        };
        return this.sendRequest("/web/dataset/search_read", params);
    }

    public logout() {
        localStorage.clear();
    }

    public call(model: string, method: string, args: any, kwargs: any) {

        kwargs = kwargs || {};
        let params = {
            model: model,
            method: method,
            args: args,
            kwargs: kwargs,
            context:this.getContext()
        };
        return this.sendRequest("/web/dataset/call_kw", params);
    }

    public createRecord(model:string,mArgs:any){
        let args = [mArgs];
        return this.call(model,"create",args,null)
    }

    public deleteRecord(model:string,id:number){
        let mArgs = [id]
        return this.call(model,"unlink",mArgs,null)
    }

    public updateRecord(model:string,id:number,mArgs:any){
        let args = [
            [id],mArgs
        ]
        return this.call(model,"write",args,null)
    }
    private getContext() {
        let response = localStorage.getItem("token");
        let jsonData = JSON.parse(response);
        let context = jsonData["user_context"];
        return context;
    }

}