const { Client } = require("pg");
const config = require("config");
const winston = require("winston");

(async () => {
  const usersTableStmt = `
        CREATE TABLE IF NOT EXISTS users(
        user_id         INT           PRIMARY KEY GENERATED ALWAYS AS IDENTITY NOT NULL,
        email           VARCHAR(100)  NOT NULL,
        password        VARCHAR(200)  NOT NULL, 
        first_name      VARCHAR(20)   NOT NULL,
        last_name       VARCHAR(20)   NOT NULL,
        phone           VARCHAR(13),
        google_id       VARCHAR(200),
        facebook_id     VARCHAR(200),
        created         TIMESTAMP CHECK(created >= CURRENT_DATE),
        modified        TIMESTAMP     NOT NULL,
        is_admin        BOOLEAN       NOT NULL
    );
    `;

  const addressTableStmt = `
    CREATE TABLE IF NOT EXISTS addresses(
        address_id          INT             PRIMARY KEY GENERATED ALWAYS AS IDENTITY NOT NULL,
        street              VARCHAR(50)     NOT NULL,
        city                VARCHAR(50)     NOT NULL,
        zip                 INT             NOT NULL,
        unit_number         INT,      
        country             VARCHAR(50)     NOT NULL,
        created             TIMESTAMP       CHECK(created >= CURRENT_DATE),
        modified            TIMESTAMP       NOT NULL,
        user_id             INT             NOT NULL,
        FOREIGN KEY(user_id) REFERENCES users(user_id) ON DELETE CASCADE ON UPDATE CASCADE,
        UNIQUE(user_id)
    );
    `;

  const categoriesTableStmt = `
    CREATE TABLE IF NOT EXISTS categories(
        category_id       INT  PRIMARY KEY GENERATED ALWAYS AS IDENTITY NOT NULL,
        category          VARCHAR(100)  UNIQUE  NOT NULL,
        description       VARCHAR(200)
    );
    `;

  const productsTableStmt = `
    CREATE TABLE IF NOT EXISTS products(
        product_id    INT                         PRIMARY KEY GENERATED ALWAYS AS IDENTITY NOT NULL,
        name          VARCHAR(100)                NOT NULL,
        description   VARCHAR(200),
        condition     VARCHAR(50)                 NOT NULL,
        quantity      INT                         NOT NULL,
        price         NUMERIC CHECK(price > 0)    NOT NULL,
        category_id   INT                         NOT NULL,
        user_id       INT                         NOT NULL,
        FOREIGN KEY(category_id) REFERENCES categories(category_id) ON DELETE CASCADE ON UPDATE CASCADE,
        FOREIGN KEY(user_id) REFERENCES users(user_id) ON DELETE CASCADE ON UPDATE CASCADE
    );
    `;

  const ordersTableStmt = `
    CREATE TABLE IF NOT EXISTS orders(
        order_id      INT                         PRIMARY KEY GENERATED ALWAYS AS IDENTITY NOT NULL,
        total         NUMERIC CHECK(total >= 0)   NOT NULL,
        status        VARCHAR(50)                 NOT NULL,
        order_date    TIMESTAMP                   NOT NULL,
        modified      TIMESTAMP                   NOT NULL,
        user_id       INT                         NOT NULL,
        FOREIGN KEY(user_id) REFERENCES users(user_id) ON DELETE CASCADE ON UPDATE CASCADE
    );
    `;

  const orderItemsTableStmt = `
    CREATE TABLE IF NOT EXISTS order_items(
      order_item_id     INT                         PRIMARY KEY GENERATED ALWAYS AS IDENTITY NOT NULL,
      name              VARCHAR(50)                 NOT NULL,
      price             NUMERIC CHECK(price > 0)    NOT NULL,
      quantity          INT                         NOT NULL,
      description       VARCHAR(200)                NOT NULL,
      created           TIMESTAMP CHECK(created >= CURRENT_DATE) NOT NULL,
      modified          TIMESTAMP                   NOT NULL,
      order_id          INT                         NOT NULL,
      product_id        INT                         NOT NULL,
      FOREIGN KEY(order_id) REFERENCES orders(order_id) ON DELETE CASCADE ON UPDATE CASCADE,
      FOREIGN KEY(product_id) REFERENCES products(product_id) ON DELETE CASCADE ON UPDATE CASCADE,
      UNIQUE(order_id, product_id)
    );
  `;

  const cartsTableStmt = `
    CREATE TABLE IF NOT EXISTS carts(
      cart_id         INT                     PRIMARY KEY GENERATED ALWAYS AS IDENTITY NOT NULL,
      created         TIMESTAMP CHECK(created >= CURRENT_DATE) NOT NULL,
      modified        TIMESTAMP               NOT NULL,
      user_id         INT                     NOT NULL,
      is_active       BOOLEAN DEFAULT TRUE   NOT NULL,
      FOREIGN KEY(user_id) REFERENCES users(user_id) ON DELETE CASCADE ON UPDATE CASCADE,
      UNIQUE(user_id)
    ); 
  `;

  const cartItemsTableStmt = `
    CREATE TABLE IF NOT EXISTS cart_items(
      cart_item_id    INT             PRIMARY KEY GENERATED ALWAYS AS IDENTITY NOT NULL,
      quantity        INT             NOT NULL,
      cart_id         INT             NOT NULL,
      product_id      INT             NOT NULL,
      FOREIGN KEY(cart_id) REFERENCES carts(cart_id) ON DELETE CASCADE ON UPDATE CASCADE,
      FOREIGN KEY(product_id) REFERENCES products(product_id) ON DELETE CASCADE ON UPDATE CASCADE,
      UNIQUE(cart_id, product_id)
    );
  `;

  try {
    const db = new Client({
      connectionString:
        process.env.NODE_ENV === "production"
          ? process.env.DATABASE_URL
          : config.get("db"),
      // ssl: {
      //   rejectUnauthorized: false,
      // },
    });

    await db
      .connect()
      .then(() => console.log("Connected successfully to the database..."))
      .catch((err) => console.log("db connection error: ", err));

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
