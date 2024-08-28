
export class InvoiceItemData {
  name: string;
  quantity: number;
  price: number;
  total: number;

  constructor(name?: string, quantity?: number, price?: number, total?: number) {
    this.name = name || '';
    this.quantity = quantity || 0;
    this.price = price || 0;
    this.total = total || 0;
  }


}