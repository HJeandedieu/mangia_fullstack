import prisma from "../src/lib/prisma.js";
import bcrypt from "bcrypt";

async function seed() {
  console.log("Starting database seed...");

  // Clear existing data
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.reservation.deleteMany();
  await prisma.menuItem.deleteMany();
  await prisma.category.deleteMany();
  await prisma.table.deleteMany();
  await prisma.user.deleteMany();

  console.log("Cleared existing data");

  // Create admin user
  const adminPassword = await bcrypt.hash("admin123", 10);
  const admin = await prisma.user.create({
    data: {
      name: "Admin User",
      email: "admin@mangia.com",
      passwordHash: adminPassword,
      role: "ADMIN",
    },
  });
  console.log("Created admin user:", admin.email);

  // Create customer users
  const customers = [];
  const customerPassword = await bcrypt.hash("customer123", 10);

  for (let i = 1; i <= 3; i++) {
    const customer = await prisma.user.create({
      data: {
        name: `Customer ${i}`,
        email: `customer${i}@mangia.com`,
        passwordHash: customerPassword,
        role: "CUSTOMER",
      },
    });
    customers.push(customer);
  }
  console.log("Created 3 customer users");

  // Create categories
  const categories = [];
  const categoryNames = [
    "Appetizers",
    "Main Courses",
    "Desserts",
    "Beverages",
    "Pasta",
  ];

  for (const name of categoryNames) {
    const category = await prisma.category.create({
      data: { name },
    });
    categories.push(category);
  }
  console.log("Created 5 categories");

  // Create menu items
  const menuItems = [];
  const items = [
    {
      category: "Appetizers",
      items: [
        {
          name: "Bruschetta al Pomodoro",
          description: "Toasted bread with fresh tomatoes, garlic, and basil",
          price: 8.99,
          imageUrl:
            "https://images.unsplash.com/photo-1599599810694-b5ac4dd07b2e?w=400&h=300&fit=crop",
        },
        {
          name: "Calamari Fritti",
          description: "Crispy fried squid with lemon aioli",
          price: 10.99,
          imageUrl:
            "https://images.unsplash.com/photo-1606787620884-c0f89cbce2e7?w=400&h=300&fit=crop",
        },
        {
          name: "Mozzarella Sticks",
          description: "Golden fried mozzarella with marinara sauce",
          price: 7.99,
          imageUrl:
            "https://images.unsplash.com/photo-1615328636155-9fcf3f1c5e10?w=400&h=300&fit=crop",
        },
      ],
    },
    {
      category: "Pasta",
      items: [
        {
          name: "Spaghetti Carbonara",
          description:
            "Classic Roman pasta with eggs, pancetta, and Pecorino Romano",
          price: 14.99,
          imageUrl:
            "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400&h=300&fit=crop",
        },
        {
          name: "Fettuccine Alfredo",
          description: "Creamy Parmesan sauce with fettuccine pasta",
          price: 13.99,
          imageUrl:
            "https://images.unsplash.com/photo-1645112411341-6c4ee32510d8?w=400&h=300&fit=crop",
        },
        {
          name: "Penne Arrabbiata",
          description: "Spicy tomato sauce with garlic and red chili",
          price: 12.99,
          imageUrl:
            "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400&h=300&fit=crop",
        },
        {
          name: "Lasagna Bolognese",
          description: "Layered pasta with rich meat sauce and mozzarella",
          price: 15.99,
          imageUrl:
            "https://images.unsplash.com/photo-1599599810694-b5ac4dd07b2e?w=400&h=300&fit=crop",
        },
      ],
    },
    {
      category: "Main Courses",
      items: [
        {
          name: "Risotto ai Funghi",
          description: "Creamy arborio rice with mushrooms and truffle oil",
          price: 16.99,
          imageUrl:
            "https://images.unsplash.com/photo-1627521509395-5ab74c99842b?w=400&h=300&fit=crop",
        },
        {
          name: "Osso Buco",
          description: "Braised veal shank with vegetable ragout",
          price: 24.99,
          imageUrl:
            "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop",
        },
        {
          name: "Branzino al Forno",
          description: "Oven-baked Mediterranean sea bass with herbs",
          price: 22.99,
          imageUrl:
            "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop",
        },
        {
          name: "Chicken Piccata",
          description: "Pan-seared chicken breast with lemon and capers",
          price: 18.99,
          imageUrl:
            "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=400&h=300&fit=crop",
        },
      ],
    },
    {
      category: "Desserts",
      items: [
        {
          name: "Tiramisu",
          description: "Classic Italian dessert with mascarpone and coffee",
          price: 7.99,
          imageUrl:
            "https://images.unsplash.com/photo-1571115764595-644a62ff9830?w=400&h=300&fit=crop",
        },
        {
          name: "Panna Cotta",
          description: "Silky vanilla panna cotta with berry compote",
          price: 8.99,
          imageUrl:
            "https://images.unsplash.com/photo-1532635241249-1cce61b8d1d7?w=400&h=300&fit=crop",
        },
        {
          name: "Gelato Trio",
          description: "Three scoops of artisanal Italian gelato",
          price: 6.99,
          imageUrl:
            "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&h=300&fit=crop",
        },
      ],
    },
    {
      category: "Beverages",
      items: [
        {
          name: "Espresso",
          description: "Strong Italian espresso",
          price: 3.99,
          imageUrl:
            "https://images.unsplash.com/photo-1559056199-641a0ac8b3f7?w=400&h=300&fit=crop",
        },
        {
          name: "Cappuccino",
          description: "Espresso with steamed milk and foam",
          price: 4.99,
          imageUrl:
            "https://images.unsplash.com/photo-1517668808822-9ebb02ae2a0e?w=400&h=300&fit=crop",
        },
        {
          name: "Prosecco",
          description: "Italian sparkling wine",
          price: 12.99,
          imageUrl:
            "https://images.unsplash.com/photo-1608270861620-7c5f5654e8ea?w=400&h=300&fit=crop",
        },
      ],
    },
  ];

  for (const categoryData of items) {
    const category = categories.find((c) => c.name === categoryData.category);
    for (const item of categoryData.items) {
      const menuItem = await prisma.menuItem.create({
        data: {
          ...item,
          price: item.price.toString(),
          available: true,
          categoryId: category.id,
        },
      });
      menuItems.push(menuItem);
    }
  }
  console.log("Created 15 menu items");

  // Create tables
  const tables = [];
  for (let i = 1; i <= 8; i++) {
    let capacity;
    if (i <= 2) capacity = 2;
    else if (i <= 5) capacity = 4;
    else capacity = 6;

    const table = await prisma.table.create({
      data: {
        tableNumber: i,
        capacity,
      },
    });
    tables.push(table);
  }
  console.log("Created 8 tables");

  // Create sample reservations
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(19, 0, 0, 0);

  await prisma.reservation.create({
    data: {
      customerId: customers[0].id,
      tableId: tables[0].id,
      reservationDate: tomorrow,
      guestCount: 2,
      status: "APPROVED",
    },
  });

  const nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 7);
  nextWeek.setHours(20, 0, 0, 0);

  await prisma.reservation.create({
    data: {
      customerId: customers[1].id,
      tableId: tables[3].id,
      reservationDate: nextWeek,
      guestCount: 4,
      status: "PENDING",
    },
  });
  console.log("Created 2 sample reservations");

  // Create sample orders
  const order1 = await prisma.order.create({
    data: {
      customerId: customers[0].id,
      orderType: "DINE_IN",
      totalAmount: (
        parseFloat(menuItems[0].price) + parseFloat(menuItems[5].price)
      ).toString(),
      status: "COMPLETED",
      items: {
        create: [
          {
            menuItemId: menuItems[0].id,
            quantity: 1,
            unitPrice: menuItems[0].price,
          },
          {
            menuItemId: menuItems[5].id,
            quantity: 1,
            unitPrice: menuItems[5].price,
          },
        ],
      },
    },
  });

  const order2 = await prisma.order.create({
    data: {
      customerId: customers[1].id,
      orderType: "DELIVERY",
      totalAmount: (
        parseFloat(menuItems[1].price) + parseFloat(menuItems[6].price)
      ).toString(),
      status: "CONFIRMED",
      deliveryAddress: "123 Main St, Downtown",
      notes: "Please ring doorbell",
      items: {
        create: [
          {
            menuItemId: menuItems[1].id,
            quantity: 1,
            unitPrice: menuItems[1].price,
          },
          {
            menuItemId: menuItems[6].id,
            quantity: 2,
            unitPrice: menuItems[6].price,
          },
        ],
      },
    },
  });
  console.log("Created 2 sample orders");

  console.log("Seed completed successfully!");
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
