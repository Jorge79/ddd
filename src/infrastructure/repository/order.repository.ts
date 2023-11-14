import Order from "../../domain/entity/order";
import OrderItem from "../../domain/entity/order_item";
import OrderRepositoryInterface from "../../domain/repository/order-repository.interface";
import OrderItemModel from "../db/sequelize/model/order-item.model";
import OrderModel from "../db/sequelize/model/order.model";

export default class OrderRepository {
  async create(entity: Order): Promise<void> {
    try {
      await OrderModel.create({
        id: entity.id,
        customer_id: entity.customerId,
        total: entity.total(),
        items: entity.items.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          product_id: item.productId,
          quantity: item.quantity
        }))
      },
        {
          include: [{ model: OrderItemModel }]
        }
      );
    } catch (error) {
      console.log("error no trycatch: `${error}`", error);
    }
  }

  async update(entity: Order): Promise<void> {
    await OrderModel.update(
      {
        items: entity.items,
        total: entity.total()
      },
      {
        where: {
          id: entity.id,
        },
      }
    );
  }

  async find(id: string): Promise<Order> {
    const orderModel = await OrderModel.findOne({ where: { id }, include: [{ association: "items" }] });
    const orderItems = orderModel.items.map((item) => new OrderItem(item.id, item.name, item.price, item.product_id, item.quantity))

    return new Order(orderModel.id, orderModel.customer_id, orderItems);
  }

  // async findAll(): Promise<Order[]> {
  //   const orderModel = await OrderModel.findAll();
  //   const orderItemModel = await OrderItemModel.findAll();

  //   return orderModel.map((orderModel) =>
  //     new Order(orderModel.id, orderModel.customer_id, orderItemModel.item)
  //   );
  // }
}

// this._id = id;
// this._name = name;
// this._price = price;
// this._quantity = quantity
// this._productId = productId

// this._id = id;
// this._name = name;
// this._price = price;
// this._quantity = quantity
// this._productId = productId