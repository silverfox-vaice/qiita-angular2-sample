import { Component, ViewChild } from '@angular/core';
import { Stock } from '../stock';
import { StockEdit } from './stock-edit.component';
import { StockService } from '../stock.service';

@Component({
  selector: 'stock-table',
  templateUrl: './app/stock/component/stock-table.component.html',
  styleUrls: ['./app/stock/component/stock-table.component.css'],
  providers: [StockEdit]
})
export class StockTable {

  private status: number;
  private data: Stock[];
  private hideElement: boolean;
  private loadElement: boolean;
  private isMobile: boolean;
  private orderField: Array < String > = ['tradingValue']

  @ViewChild(StockEdit) stockEdit: StockEdit;

  constructor(private service: StockService, private window: Window) {
    this.updateStatus();
    this.bind();
  }

  private bind() {
    this.service.updated.subscribe((stock: Stock) => { this.updateStatus() });
    this.service.fetchedList.subscribe((data: Stock[]) => { this.success(data) });
  }

  updateStatus() {
    this.hideElement = true;
    this.loadElement = false;
    this.service.fetchList();
  }

  success(data: Stock[]) {
    if(window.innerWidth < 900) {
      this.isMobile = true;
    } else {
      this.isMobile = false;
    }
    this.data = data;
    this.hideElement = false;
    this.loadElement = true;
  }

  sort(elmName: string) {
    this.orderField = [elmName];
  }

  showInfo(stcok: Stock) {
    this.service.fetchItem(stcok.code);
  }
}
