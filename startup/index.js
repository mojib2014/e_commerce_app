// const expressLoader = require("./express");
// const passportLoader = require("./passport");
// const routeLoader = require("../routes");
// const swaggerLoader = require("./swagger");

// module.exports = async (app) => {
//   // Load Express middlewares
//   const expressApp = await expressLoader(app);

//   // Load Passport middleware
//   const passport = await passportLoader(expressApp);

//   // Load API route handlers
//   await routeLoader(app, passport);

//   // Load Swagger
//   await swaggerLoader(app);

//   // Error Handler
//   app.use((err, req, res, next) => {
//     const { message, status } = err;

//     return res.status(status || 500).send({ message });
//   });
// };
