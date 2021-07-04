const { Client } = require("pg");
const config = require("config");
const winston = require("winston");

(async () => {
  const usersTableStmt = `
        CREATE TABLE IF NOT EXISTS users(
        id              INT           PRIMARY KEY GENERATED ALWAYS AS IDENTITY NOT NULL,
        email           VARCHAR(100)  NOT NULL,
        password        VARCHAR(200)   NOT NULL, 
        first_name      VARCHAR(20)   NOT NULL,
        last_name       VARCHAR(20)   NOT NULL,
        phone           VARCHAR(13),
        google          JSON,
        facebook        JSON,
        created         DATE,
        modified        DATE,
        is_admin        BOOLEAN       NOT NULL
    );
    `;

  const addressTableStmt = `
    CREATE TABLE IF NOT EXISTS address(
        id                  INT             PRIMARY KEY GENERATED ALWAYS AS IDENTITY NOT NULL,
        street              VARCHAR(50)     NOT NULL,
        city                VARCHAR(50)     NOT NULL,
        zip                 INT             NOT NULL,
        unit_number         INT,
        country             VARCHAR(50)     NOT NULL,
        created             DATE,
        modified            DATE,
        user_id             INT             NOT NULL,
        FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
        UNIQUE(user_id)
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
        id            INT                         PRIMARY KEY GENERATED ALWAYS AS IDENTITY NOT NULL,
        name          VARCHAR(100)                NOT NULL,
        description   VARCHAR(200),
        condition     VARCHAR(50)                 NOT NULL,
        quantity      INT                         NOT NULL,
        price         NUMERIC CHECK(price > 0)    NOT NULL,
        category_id   INT                         NOT NULL,
        user_id       INT                         NOT NULL,
        FOREIGN KEY(category_id) REFERENCES categories(id) ON DELETE CASCADE ON UPDATE CASCADE,
        FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE
    );
    `;

  const ordersTableStmt = `
    CREATE TABLE IF NOT EXISTS orders(
        id            INT                         PRIMARY KEY GENERATED ALWAYS AS IDENTITY NOT NULL,
        total         NUMERIC CHECK(total >= 0)   NOT NULL,
        status        VARCHAR(50)                 NOT NULL,
        order_date    DATE                        NOT NULL,
        modified      DATE                        NOT NULL,
        user_id       INT                         NOT NULL,
        FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE
    );
    `;

  const orderItemsTableStmt = `
    CREATE TABLE IF NOT EXISTS orderItems (
      id                INT                         PRIMARY KEY GENERATED ALWAYS AS IDENTITY NOT NULL,
      name              VARCHAR(50)                 NOT NULL,
      price             NUMERIC CHECK(price > 0)    NOT NULL,
      quantity          INT                         NOT NULL,
      description       VARCHAR(200)                NOT NULL,
      created           DATE                        NOT NULL,
      order_id          INT                         NOT NULL,
      product_id        INT                         NOT NULL,
      FOREIGN KEY(order_id) REFERENCES orders(id),
      FOREIGN KEY(product_id) REFERENCES products(id)
    )
  `;

  const cartsTableStmt = `
    CREATE TABLE IF NOT EXISTS carts (
      id              INT             PRIMARY KEY GENERATED ALWAYS AS IDENTITY NOT NULL,
      created         DATE,
      modified        DATE,
      user_id         INT             NOT NULL,
      is_active       BOOLEAN         NOT NULL,
      FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
      UNIQUE(user_id)
    ); 
  `;

  const cartItemsTableStmt = `
    CREATE TABLE IF NOT EXISTS cartItems (
      id              INT             PRIMARY KEY GENERATED ALWAYS AS IDENTITY NOT NULL,
      quantity        INT             NOT NULL,
      cart_id         INT             NOT NULL,
      product_id      INT             NOT NULL,
      FOREIGN KEY(cart_id) REFERENCES carts(id),
      FOREIGN KEY(product_id) REFERENCES products(id)
    );
  `;

  try {
    const db = new Client(config.get("db"));

    await db
      .connect()
      .then(() => winston.info("Connected successfully to the database..."))
      .catch((err) => winston.info(err.message));

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
    winston.info("ERROR CREATING ONE OR MORE TABLES: ", err);
  }
})();
