import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class Api {
  // url: string = 'https://agritama.farm/api';
  url: string = 'http://localhost';

  constructor(public httpClient: HttpClient, public http: Http) {
  }

  // ---------------------------------------------------------------------
  get(endpoint: string, params?: any, reqOpts?: any) {
    if (!reqOpts) {
      reqOpts = {
        params: new HttpParams()
      };
    }

    if (params) {
      reqOpts.params = new HttpParams();
      for (let k in params) {
        reqOpts.params = reqOpts.params.set(k, params[k]);
      }
    }

    return this.httpClient.get(this.url + '/' + endpoint, reqOpts);
  }

  _get(endpoint: string, reqOpts?: any) {
    return this.http.get(this.url + '/' + endpoint, reqOpts);
  }

  // ---------------------------------------------------------------------
  post(endpoint: string, body: any, reqOpts?: any) {
    return this.httpClient.post(this.url + '/' + endpoint, body, reqOpts);
  }

  _post(endpoint: string, body: any, reqOpts?: any) {
    return this.http.post(this.url + '/' + endpoint, body, reqOpts);
  }

  // ---------------------------------------------------------------------
  put(endpoint: string, body: any, reqOpts?: any) {
    return this.httpClient.put(this.url + '/' + endpoint, body, reqOpts);
  }

  _put(endpoint: string, body: any, reqOpts?: any) {
    return this.http.put(this.url + '/' + endpoint, body, reqOpts);
  }

  // ---------------------------------------------------------------------
  delete(endpoint: string, reqOpts?: any) {
    return this.httpClient.delete(this.url + '/' + endpoint, reqOpts);
  }

  _delete(endpoint: string, reqOpts?: any) {
    return this.http.delete(this.url + '/' + endpoint, reqOpts);
  }

  // ---------------------------------------------------------------------
  patch(endpoint: string, body: any, reqOpts?: any) {
    return this.httpClient.patch(this.url + '/' + endpoint, body, reqOpts);
  }

  _patch(endpoint: string, body: any, reqOpts?: any) {
    return this.http.patch(this.url + '/' + endpoint, body, reqOpts);
  }

  // ---------------------------------------------------------------------
  upload(endpoint: string, body: any) {
    return this.httpClient.post(this.url + '/' + endpoint, body);
  }

  _upload(endpoint: string, body: any, reqOpts?: any) {
    return this.http.post(this.url + '/' + endpoint, body, reqOpts);
  }

  // ---------------------------------------------------------------------
  postData(credentials, endpoint) {
    return new Promise((resolve, reject) => {
      let headers = new Headers();
      this.http.post(this.url + '/' + endpoint, credentials, { headers: headers }).
      subscribe(res => {
        resolve(res.json());
      }, (err) => {
        reject(err);
      });
    });
  }

  // ---------------------------------------------------------------------
  postToken(endpoint, body, token) {
    return new Promise((resolve, reject) => {
      let headers = new Headers();
      headers.append('Content-Type', 'application/json');
      headers.append('Accept', 'application/json');
      headers.append('Authorization', 'Bearer ' + token);
      this.http.post(this.url + '/' + endpoint, body, { headers: headers }).
      subscribe(res => {
        resolve(res.json());
      }, (err) => {
        reject(err);
      });
    });
  }

  // ---------------------------------------------------------------------
  getData(endpoint) {
    return new Promise((resolve, reject) => {
      this.http.get(this.url + '/' + endpoint).
      subscribe(res => {
        resolve(res.json());
      }, (err) => {
        reject(err);
      });
    });
  }
}
