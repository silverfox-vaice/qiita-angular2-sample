import { Component } from '@angular/core';
import { StockService } from '../stock.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'stock-admin',
  templateUrl: './app/stock/component/stock-admin.component.html',
  styleUrls: ['./app/stock/component/stock-admin.component.css']
})
export class StockAdmin {
  private hideElement: boolean;

  constructor(private service: StockService) {}

  delete() {
    this.service.delete();
  }
  register() {
    this.service.register();
  }
}
