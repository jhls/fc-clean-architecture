import { Sequelize } from "sequelize-typescript";
import CustomerModel from "../../../customer/repository/sequelize/customer.model";
import OrderItemModel from "./order-item.model";
import ProductModel from "../../../product/repository/sequelize/product.model";
import CustomerRepository from "../../../customer/repository/sequelize/customer.repository";
import OrderItem from "../../../../domain/checkout/entity/order_item";
import Order from "../../../../domain/checkout/entity/order";
import OrderRepository from "./order.repository";
import Customer from "../../../../domain/customer/entity/customer";
import Address from "../../../../domain/customer/value-object/address";
import ProductRepository from "../../../product/repository/sequelize/product.repository";
import Product from "../../../../domain/product/entity/product";
import OrderModel from "./order.model";

describe("Order repository test", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([
      CustomerModel,
      OrderModel,
      OrderItemModel,
      ProductModel,
    ]);

    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should create a new order", async () => {
    const customerRepository = new CustomerRepository();
    const customer = new Customer("123","Customer 1");
    const address = new Address("Street 1",1,"Zipcode 1", "City 1");

    customer.changeAddress(address);
    await customerRepository.create(customer);

    const productRepository = new ProductRepository();
    const product = new Product("123","Product 1",10);
    await productRepository.create(product);

    const orderItem = new OrderItem("1",product.name,product.price,product.id,2);

    const order = new Order("123","123",[orderItem]);

    const orderRepository =new OrderRepository();
    await orderRepository.create(order);

    const orderModel = await OrderModel.findOne({
      where: {id: order.id},
      include: ["items"],
    });

    expect(orderModel.toJSON()).toStrictEqual({
      id: "123",
      customer_id: "123",
      total: order.total(),
      items: [
        {
          id: orderItem.id,
          name: orderItem.name,
          price: orderItem.price,
          quantity: orderItem.quantity,
          order_id: "123",
          product_id: "123",
        }
      ],

    })
  });

  it("should update a order", async () => {
   
    //Cria o agregado de customer
    const customerRepository = new CustomerRepository();
    const customer = new Customer("123","Customer 1");
    const address = new Address("Street 1",1,"Zipcode 1", "City 1");

    customer.changeAddress(address);
    
    await customerRepository.create(customer);


    //Adiciona o produto
    const productRepository = new ProductRepository();
    const product = new Product("123","Product 1",10);
    
    await productRepository.create(product);


    //Adiciona a ordem
    const orderItem = new OrderItem("1",product.name,product.price,product.id,2);
    const order = new Order("123","123",[orderItem]);

    const orderRepository =new OrderRepository();
    
    await orderRepository.create(order);

    const orderModel = await OrderModel.findOne({
      where: {id: order.id},
      include: ["items"],
    });

    //Testa a primeira iteração 
    expect(orderModel.toJSON()).toStrictEqual({
      id: "123",
      customer_id: "123",
      total: order.total(),
      items: [
        {
          id: orderItem.id,
          name: orderItem.name,
          price: orderItem.price,
          quantity: orderItem.quantity,
          order_id: "123",
          product_id: "123",
        }
      ],
    })
    
    //Adicionando produto
    const product2 = new Product("1234","Product 2",25);
    await productRepository.create(product2);

    //Adicionando novo item
    const orderItem2 = new OrderItem("2",product2.name,product2.price,product2.id,1);
    const order2 = new Order(order.id,order.customerId,[orderItem,orderItem2]);
    
    await orderRepository.update(order2);

    const orderModel2 = await OrderModel.findOne({
      where: {id: order2.id},
      include: ["items"],
    });

    //Testa a segunda iteração 
    expect(orderModel2.toJSON()).toStrictEqual({
      id: "123",
      customer_id: "123",
      total: order2.total(),
      items: [
        {
          id: orderItem.id,
          name: orderItem.name,
          price: orderItem.price,
          quantity: orderItem.quantity,
          order_id: "123",
          product_id: "123",
        },
        {
          id: orderItem2.id,
          name: orderItem2.name,
          price: orderItem2.price,
          quantity: orderItem2.quantity,
          order_id: "123",
          product_id: "1234",
        }
      ],
    })

    

  });

  it("should find a order by id", async () => {
    const customerRepository = new CustomerRepository();
    const customer = new Customer("123","Customer 1");
    const address = new Address("Street 1",1,"Zipcode 1", "City 1");

    customer.changeAddress(address);
    await customerRepository.create(customer);

    const productRepository = new ProductRepository();
    const product = new Product("123","Product 1",10);
    await productRepository.create(product);

    const orderItem = new OrderItem("1",product.name,product.price,product.id,2);

    const order = new Order("123","123",[orderItem]);

    const orderRepository =new OrderRepository();
    await orderRepository.create(order);

    const orderResult = await orderRepository.find(order.id);

    expect(order).toStrictEqual(orderResult);
     
  
  });

  it("should find all orders", async () => {
    const customerRepository = new CustomerRepository();
    const customer = new Customer("123","Customer 1");
    const address = new Address("Street 1",1,"Zipcode 1", "City 1");

    customer.changeAddress(address);
    await customerRepository.create(customer);

    const productRepository = new ProductRepository();
    const product = new Product("123","Product 1",10);
    await productRepository.create(product);

    const orderRepository =new OrderRepository();


    //Adicionando a ordem 1
    const orderItem = new OrderItem("1",product.name,product.price,product.id,2);
    const order = new Order("1","123",[orderItem]);
    await orderRepository.create(order);

    //Adicionando a ordem 2
    const orderItem2 = new OrderItem("2",product.name,product.price,product.id,2);
    const order2 = new Order("2","123",[orderItem2]);
    await orderRepository.create(order2);

   

    const foundOrders = await orderRepository.findAll();
    const orders = [order,order2];

    expect(orders).toEqual(foundOrders);
     
  
  });
  
});