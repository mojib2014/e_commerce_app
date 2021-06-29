const { Client } = require("pg");
const { DB } = require("./config");

(async () => {
  const usersTableStmt = `
        CREATE TABLE IF NOT EXISTS users(
        id              INT           PRIMARY KEY GENERATED ALWAYS AS IDENTITY NOT NULL,
        email           VARCHAR(100)  NOT NULL,
        password        VARCHAR(50)   NOT NULL, 
        first_name      VARCHAR(20)   NOT NULL,
        last_name       VARCHAR(20)   NOT NULL,
        phone           CHAR(13),
        google          JSON,
        facebook        JSON
    );
    `;

  const addressTableStmt = `
    CREATE TABLE IF NOT EXISTS address(
        street              VARCHAR(50),
        city                VARCHAR(50),
        zip                 INT,
        unit_number         INT,
        country             VARCHAR(50),
        user_id             INT NOT NULL,
        FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE
    );
    `;

  const ordersTableStmt = `
    CREATE TABLE IF NOT EXISTS orders(
        id            INT         PRIMARY KEY GENERATED ALWAYS AS IDENTITY NOT NULL,
        total         BIGINT         NOT NULL,
        user_id       INT         NOT NULL,
        status        VARCHAR(50) NOT NULL,
        order_date    DATE        NOT NULL,
        modified      DATE        NOT NULL,
        FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE
    );
    `;

  const categoriesTableStmt = `
    CREATE TABLE IF NOT EXISTS categories(
        id          INT           PRIMARY KEY GENERATED ALWAYS AS IDENTITY NOT NULL,
        category    VARCHAR(100)  NOT NULL,
        description VARCHAR(200)
    );
    `;

  const productsTableStmt = `
    CREATE TABLE IF NOT EXISTS products(
        id            INT           PRIMARY KEY GENERATED ALWAYS AS IDENTITY NOT NULL,
        name          VARCHAR(100)  NOT NULL,
        description   VARCHAR(200),
        condition     VARCHAR(50)   NOT NULL,
        quantity      INT       NOT NULL,
        price         BIGINT        NOT NULL,
        category_id   INT           NOT NULL,
        FOREIGN KEY(category_id) REFERENCES categories(id) ON DELETE CASCADE ON UPDATE CASCADE
    );
    `;

  const cartsTableStmt = `
    CREATE TABLE IF NOT EXISTS carts (
      id              INT             PRIMARY KEY GENERATED ALWAYS AS IDENTITY NOT NULL,
      user_id         INT             NOT NULL,
      modified        DATE            NOT NULL,
      created         DATE            NOT NULL,
      FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE
    ); 
  `;

  const orderItemsTableStmt = `
  CREATE TABLE IF NOT EXISTS orderItems (
    id                INT             PRIMARY KEY GENERATED ALWAYS AS IDENTITY NOT NULL,
    created           DATE            NOT NULL,
    order_id          INT             NOT NULL,
    quantity          INT             NOT NULL,
    price             BIGINT             NOT NULL,
    product_id        INT             NOT NULL,
    name              VARCHAR(50)     NOT NULL,
    description       VARCHAR(200)    NOT NULL,
    FOREIGN KEY(order_id) REFERENCES orders(id),
    FOREIGN KEY(product_id) REFERENCES products(id)
  )
`;

  const cartItemsTableStmt = `
    CREATE TABLE IF NOT EXISTS cartItems (
      id              INT             PRIMARY KEY GENERATED ALWAYS AS IDENTITY NOT NULL,
      cart_id         INT             NOT NULL,
      product_id      INT             NOT NULL,
      quantity        INT             NOT NULL,
      FOREIGN KEY (cart_id) REFERENCES carts(id),
      FOREIGN KEY (product_id) REFERENCES products(id)
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

    await db.connect();
    // .then(() => console.log("Connected successfully to the database..."))
    // .catch((err) => console.log(err.message));

    // Create tables on database
    await db.query(usersTableStmt);
    await db.query(addressTableStmt);
    await db.query(categoriesTableStmt);
    await db.query(productsTableStmt);
    await db.query(ordersTableStmt);
    await db.query(orderItemsTableStmt);
    await db.query(cartsTableStmt);
    await db.query(cartItemsTableStmt);

    await db.end();
  } catch (err) {
    console.log("ERROR CREATING ONE OR MORE TABLES: ", err);
  }
})();
