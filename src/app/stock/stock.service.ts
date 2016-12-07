import { Injectable, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { Stock } from './stock';
import { Headers, Http, RequestOptions, Response } from '@angular/http';
import { API_ENDPOINT } from '../configs/app.configs';

@Injectable()
export class StockService {

  @Output() fetchedList = new EventEmitter < Stock[] > ();
  @Output() fetchedItem = new EventEmitter < Stock > ();
  @Output() updated = new EventEmitter < Stock > ();
  @Output() deleted = new EventEmitter < Stock[] > ();
  @Output() registered = new EventEmitter < Stock[] > ();
  @Output() updateFailed = new EventEmitter < string > ();

  private url: string = API_ENDPOINT;

  constructor(private http: Http) {}

  update(code: string, body: string) {
    this.put(code, body).subscribe(
      data => {
        this.updated.emit(data)
      },
      data => {
        this.updateFailed.emit(data)
      }
    );
  }

  delete() {
    this.deleteAll().subscribe(
      data => {
        this.deleted.emit(data)
      }
    );
  }

  register() {
    this.post().subscribe(
      data => {
        this.deleted.emit(data)
      }
    );
  }

  fetchList() {
    this.fetch().subscribe(
      data => {
        this.fetchedList.emit(data)
      }
    );
  }

  fetchItem(code: string) {
    this.get(code).subscribe(
      data => {
        this.fetchedItem.emit(data)
      }
    );
  }

  private get(code: string): Observable < Stock > {
    return this.http.get(`${this.url}/stock/code/${code}`).map(res => res.json().entity as Stock);
  }

  private fetch(): Observable < Stock[] > {
    return this.http.get(`${this.url}/stock/list`).map(res => res.json().entity as Stock[]);
  }

  private put(code: string, body: string): Observable < Stock > {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    return this.http.put(`${this.url}/stock/code/${code}`, body, options).map(res => res.json().entity as Stock).catch((res) => res);
  }

  private deleteAll(): Observable < Stock[] > {
    return this.http.delete(`${this.url}/stock`).map(res => res.json());
  }

  private post(): Observable < Stock[] > {
    return this.http.post(`${this.url}/stock`, null).map(res => res.json());
  }
}
