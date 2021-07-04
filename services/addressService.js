const createError = require("http-errors");
const Address = require("../models/address");

const addressInstance = new Address();

module.exports = class AddressService {
  // Creates a new address record
  async create(data) {
    try {
      const address = await addressInstance.create(data);

      return address;
    } catch (err) {
      throw err;
    }
  }

  // Updates an existing address record for a given user
  async update(id, data) {
    try {
      const address = await addressInstance.update(id, data);

      if (!address)
        throw createError(404, "No address with given ID was found!");

      return address;
    } catch (err) {
      throw err;
    }
  }

  // Retrieves an existing address record for a given user
  async getAddressByUserId(id) {
    try {
      const address = await addressInstance.getAddressByUserId(id);

      if (!address)
        throw createError(
          404,
          "A address with the given user ID was not found!",
        );

      return address;
    } catch (err) {
      throw err;
    }
  }
};
