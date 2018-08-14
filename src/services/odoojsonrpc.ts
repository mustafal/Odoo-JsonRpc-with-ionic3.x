import 'rxjs/add/operator/toPromise';
import 'rxjs/Rx';

import { Headers, Http } from '@angular/http';
import { Utils } from './utils';
import { List } from 'ionic-angular/components/list/list';
import { Injectable } from '@angular/core';

@Injectable()
export class OdooJsonRpc {

    private jsonRpcID: number = 0;
    private headers: Headers;
    private odoo_server: string;
    private http_auth: string;
    private list = "/web/database/list";
    private get_list = "/web/database/get_list";
    private jsonrpc = "/jsonrpc";

    constructor(private http: Http, private utils: Utils) {
        this.http = http;
    }

    /**
     * Builds a request for odoo server
     * @param url Odoo Server URL
     * @param params Object
     */
    private buildRequest(url: String, params: any) {
        this.jsonRpcID += 1;
        return JSON.stringify({
            jsonrpc: "2.0",
            method: "call",
            id: this.jsonRpcID,
            params: params,
        });
    }

    /**
     * Returns the error message
     * @param response Error response from server
     */
    public handleOdooErrors(response: any) {
        let err: string = response.error.data.message
        let msg = err.split("\n")
        let errMsg = msg[0]

        this.utils.presentAlert("Error", errMsg, [{
            text: "Ok",
            role: "cancel"
        }])
    }

    /**
     * Handles HTTP errors
     */
    public handleHttpErrors(error: any) {
        return Promise.reject(error.message || error);
    }

    /**
     * Sends a JSON request to the odoo server
     * @param url Url of odoo
     * @param params Object
     */
    public sendRequest(url: string, params: Object): Promise<any> {
        let options = this.buildRequest(url, params);
        this.headers = new Headers({
            'Content-Type': 'application/json; charset=utf-8',
        });

        let result = this.http.post(this.odoo_server + url, options, { headers: this.headers })
            .toPromise()
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

    /**
     * Gets the server info
     */
    public getServerInfo() {
        return this.sendRequest("/web/webclient/version_info", {});
    }


    /**
     * Gets the session info
     */
    public getSessionInfo() {
        return this.sendRequest("/web/session/get_session_info", {});
    }


    /**
     * Gets the Odoo Server Version Number
     */
    public getServerVersionNumber(): Promise<number> {
        return this.getServerInfo().then((res: any): Promise<number> => {
            return new Promise<number>((resolve) => {
                resolve(JSON.parse(res._body)["result"]["server_version_info"][0]);
            });
        });
    }

    /**
     * Get the database list
     */
    public getDbList(): Promise<string> {
        let dbParams = {
            context: {}
        }
        return this.getServerVersionNumber().then((data: number) => {
            if (data <= 8) {
                return this.sendRequest(this.get_list, dbParams);
            } else if (data == 9) {
                return this.sendRequest(this.jsonrpc, dbParams);
            } else {
                return this.sendRequest(this.list, dbParams);
            }
        })
    }

    /**
     * Returns all modules that are installed in your database
     */
    public modules(): Promise<string> {
        let params = {
            context: {}
        }
        return this.sendRequest("/web/session/modules", params)
    }


    /**
     * Login to the database
     * @param db Database name of odoo
     * @param login Username
     * @param password password
     */
    public login(db: string, login: string, password: string) {
        let params = {
            db: db,
            login: login,
            password: password,
            base_location: this.odoo_server,
            context: {}
        };
        return this.sendRequest("/web/session/authenticate", params)
    }

    /**
     * Check whether the session is live or not
     */
    public check(): Promise<string> {
        let params = {
            context: this.getContext()
        }
        return this.sendRequest("/web/session/check", params)
    }


    /**
     * Destroy the session 
     */
    public destroy() {
        let params = {
            context: {}
        }
        return this.sendRequest("/web/session/destroy", params)
    }


    /**
     * Fires query in particular model with fields and conditions
     * @param model Model name
     * @param domain Conditions that you want to fire on your query
     *              (e.g) let domain = [
     *                         ["id","=",11]
     *                    ]
     * @param fields Fields names which you want to bring from server
     *              (e.g) let fields = [
     *                         ["id","name","email"]
     *                    ]
     * @param limit limit of the record
     * @param offset 
     * @param sort sorting order of data (e.g) let sort = "ascending"
     */
    public searchRead(model: string, domain: any, fields: any, limit: number, offset: any, sort: string) {
        let params = {
            model: model,
            fields: fields,
            domain: domain,
            offset: offset,
            limit: limit,
            sort: sort,
            context: this.getContext()
        };
        return this.sendRequest("/web/dataset/search_read", params);
    }


    /**
     * Calls the method of that particular model
     * @param model Model name
     * @param method Method name of particular model
     * @param args Array of fields
     * @param kwargs Object
     */
    public call(model: string, method: string, args: any, kwargs?: any) {

        kwargs = kwargs || {};
        let params = {
            model: model,
            method: method,
            args: args,
            kwargs: kwargs == false ? {} : kwargs,
            context: this.getContext()
        };
        return this.sendRequest("/web/dataset/call_kw", params);
    }


    /**
     * Reads that perticular fields of that particular ID
     * @param model Model Name
     * @param id Id of that record which you want to read
     * @param mArgs Array of fields which you want to read of the particular id
     */

    public read(model: string, id: Array<number>, mArgs: Array<string>): Promise<any> {
        let args = [
            id, mArgs
        ]
        return this.call(model, 'read', args)
    }


    /**
     * Loads all data of the paricular ID
     * @param model Model name
     * @param id Id of that particular data which you want to load
     */
    public load(model: string, id: number): Promise<any> {
        let params = {
            model: model,
            id: id,
            fields: [],
            context: this.getContext()
        }
        return this.sendRequest("/web/dataset/load", params)
    }


    /**
     * Provide the name that you want to search
     * @param model Model name
     * @param name Name that you want to search
     */
    public nameSearch(model: string, name: string): Promise<any> {
        let kwargs = {
            name: name,
            args: [],
            operator: "ilike",
            limit: 0
        }
        return this.call(model, 'name_search', [], kwargs)
    }


    /**
     * Provide the IDs and you will get the names of that paticular IDs
     * @param model Model name
     * @param mArgs Array of IDs that you want to pass
     */
    public nameGet(model: string, mArgs: any): Promise<any> {
        let args = [mArgs]
        return this.call(model, 'name_get', args)
    }

    /**
     * Create a new record
     * @param model Model name
     * @param mArgs Object of fields and value
     */
    public createRecord(model: string, mArgs: any) {
        let args = [mArgs];
        return this.call(model, "create", args, null)
    }



    /**
     * Delete the record of particular ID
     * @param model Model Name
     * @param id Id of record that you want to delete
     */
    public deleteRecord(model: string, id: number) {
        let mArgs = [id]
        return this.call(model, "unlink", mArgs, null)
    }


    /**
     * Updates the record of particular ID
     * @param model Model Name
     * @param id Id of record that you want to update the. 
     * @param mArgs The Object of fields and value that you want to update
     *              (e.g)
     *              let args = {
     *                 "name": "Mtfa"
     *              }
     */
    public updateRecord(model: string, id: number, mArgs: any) {
        let args = [
            [id], mArgs
        ]
        return this.call(model, "write", args, null)
    }

    /**
     * Get the User Context from the response of odoo server
     */
    private getContext() {
        let response = localStorage.getItem("token");
        let jsonData = JSON.parse(response);
        let context = jsonData["user_context"];
        return context;
    }

}