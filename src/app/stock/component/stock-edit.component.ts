import { Component } from '@angular/core';
import { Stock } from '../stock';
import { StockService } from '../stock.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'stock-edit',
  templateUrl: './app/stock/component/stock-edit.component.html',
  styleUrls: ['./app/stock/component/stock-edit.component.css']
})
export class StockEdit {
  private hideElement: boolean;
  private hideSuccess: boolean;
  private hideFaild: boolean;
  private model: Stock;

  constructor(private service: StockService) {
    this.clean();
    this.bind();
  }

  private bind() {
    this.service.updated.subscribe((stock: Stock) => { this.success(stock) });
    this.service.updateFailed.subscribe((stock: Stock) => { this.success(stock) });
    this.service.fetchedItem.subscribe((stock: Stock) => { this.open(stock) });
  }

  private clean() {
    this.model = new Stock();
    this.hideElement = true;
    this.hideSuccess = true;
    this.hideFaild = true;
  }

  private open(stock: Stock) {
    if(stock == null) {
      stock = new Stock();
    }
    this.model = stock;
    this.hideElement = false;
  }

  private close() {
    this.clean();
  }

  private onSubmit(f: NgForm) {
    this.hideSuccess = true;
    this.hideFaild = true;
    let bodyString = JSON.stringify(f.value);
    this.service.update(f.value.code, bodyString)
  }


  private success(stock: Stock) {
    this.model = stock;
    this.hideSuccess = false;
  }

  private faild(message: string) {
    this.hideFaild = false;
  }
}
