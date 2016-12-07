import "core-js";
import "zone.js";
import "rxjs/Rx";

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { StockModule } from './stock/stock.module';
const platform = platformBrowserDynamic();

export function init(): void {
  platform.bootstrapModule(StockModule);
}
document.addEventListener("DOMContentLoaded", init);
