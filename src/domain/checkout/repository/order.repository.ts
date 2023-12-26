import Order from "../entity/order";
import OrderItem from "../entity/order_item";
import OrderRepositoryInterface from "./order-repository.interface";
import OrderItemModel from "../../../infrastructure/db/sequelize/model/order-item.model";
import OrderModel from "../../../infrastructure/db/sequelize/model/order.model";

export default class OrderRepository implements OrderRepositoryInterface {
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
    const sequelize = OrderModel.sequelize;
    await sequelize.transaction(async (t) => {
      await OrderItemModel.destroy({
        where: { order_id: entity.id },
        transaction: t,
      });
      const items = entity.items.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        product_id: item.productId,
        quantity: item.quantity,
        order_id: entity.id,
      }));
      await OrderItemModel.bulkCreate(items, { transaction: t });
      await OrderModel.update(
        { total: entity.total() },
        { where: { id: entity.id }, transaction: t }
      );
    });
  }

  async find(id: string): Promise<Order> {
    const orderModel = await OrderModel.findOne({ where: { id }, include: [{ association: "items" }] });
    const orderItems = orderModel.items.map((item) => new OrderItem(item.id, item.name, item.price, item.product_id, item.quantity))

    return new Order(orderModel.id, orderModel.customer_id, orderItems);
  }

  async findAll(): Promise<Order[]> {
    const orderModels = await OrderModel.findAll({ include: [{ association: "items" }] });
    return orderModels.map((model) => (
      new Order(model.id, model.customer_id, model.items.map((item) => (
        new OrderItem(item.id, item.name, item.price, item.product_id, item.quantity)
      )))
    ))
  }
}