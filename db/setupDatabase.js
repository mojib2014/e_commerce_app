const { Client } = require("pg");
const { DB } = require("../config");

(async () => {
  const users = `
        CREATE TABLE IF NOT EXISTS users(
        id BIGSERIAL primary key not null,
        first_name VARCHAR(20),
        last_name VARCHAR(20),
        phone CHAR(13),
        email_address VARCHAR(100),
        password VARCHAR(50) 
    );
    `;
  const address = `
    CREATE TABLE IF NOT EXISTS address(
        street varchar(50),
        city VARCHAR(50),
        zip integer,
        unit_number INTEGER,
        country VARCHAR(50),
        user_id BIGSERIAL references users(id)
    );
    `;

  const orders = `
    CREATE TABLE IF NOT EXISTS orders(
        id BIGSERIAL primary key not null,
        order_date DATE,
        user_id BIGSERIAL references users(id),
        product_id BIGSERIAL references products(id)
    );
    `;
  const products = `
    CREATE TABLE IF NOT EXISTS products(
        id BIGSERIAL primary key not null,
        name VARCHAR(100),
        description VARCHAR(200),
        condition VARCHAR(50),
        quantity INTEGER,
        price money,
        category_id BIGSERIAL references categories(id)
    );
    `;

  const categories = `
    CREATE TABLE IF NOT EXISTS categories(
        id BIGSERIAL primary key not null,
        category VARCHAR(100),
        description VARCHAR(200)
    );
    `;

  const shipment = `
    CREATE TABLE IF NOT EXISTS shipment(
        product_id BIGSERIAL references products(id),
        order_id BIGSERIAL references orders(id),
        packing_time TIME,
        ship_date DATE 
    );
    `;

  try {
    const db = new Client({
      user: DB.PGUSER,
      host: DB.PGHOST,
      database: DB.PGDATABASE,
      password: DB.PGPASSWORD,
      port: DB.PGPORT,
    });

    await db
      .connect()
      .then(() => console.log("Connected successfully to the database..."))
      .catch((err) => console.log(err.message));

    // Create tables on database
    await db.query(users);
    await db.query(products);
    await db.query(orders);
    await db.query(categories);
    await db.query(shipment);
    await db.query(address);

    await db.end();
  } catch (err) {
    console.log("ERROR CREATING ONE OR MORE TABLES: ", err);
  }
})();
