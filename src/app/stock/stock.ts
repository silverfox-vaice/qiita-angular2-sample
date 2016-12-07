export class Stock {
  constructor(
    public code: string = null,
    public name: string = null,
    public market: string = null,
    public openingPrice: number = null,
    public highprice: number = null,
    public lowPrice: number = null,
    public closingPrice: number = null,
    public volume: number = null,
    public tradingValue: number = null
  ) {}
}
