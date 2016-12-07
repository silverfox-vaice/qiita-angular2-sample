import { NgModule, ValueProvider } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { StockTable } from './component/stock-table.component';
import { StockEdit } from './component/stock-edit.component';
import { StockAdmin } from './component/stock-admin.component';
import { StockService } from './stock.service';
import { OrderByPipe } from '../pipe/order-by.pipe';
import { FormsModule } from '@angular/forms';

const WINDOW_PROVIDER: ValueProvider = {
  provide: Window,
  useValue: window
};

@NgModule({
  providers: [
    WINDOW_PROVIDER, StockService
  ],
  imports: [BrowserModule, HttpModule, FormsModule],
  declarations: [StockTable, StockEdit, OrderByPipe, StockAdmin],
  entryComponents: [StockEdit],
  bootstrap: [StockTable]
})
export class StockModule {}
