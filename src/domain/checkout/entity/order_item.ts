export default class OrderItem {

  private _id: string;
  private _productId: string
  private _name: string;
  private _price: number;
  private _quantity: number;

  constructor(id: string, name: string, price: number, productId: string, quantity: number) {
    this._id = id;
    this._name = name;
    this._price = price;
    this._quantity = quantity
    this._productId = productId
  }

  get id(): string {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get quantity(): number {
    return this._quantity;
  }

  get price(): number {
    return this._price
  }

  get productId(): string {
    return this._productId
  }

  changeName(name: string) {
    this._name = name
  }

  changePrice(price: number) {
    this._price = price
  }

  changeQuantity(quantity: number) {
    this._quantity = quantity
  }

  orderItemTotal(): number {
    return this._price * this._quantity;
  }
}