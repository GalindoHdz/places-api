const Joi = require("joi");
const Users = require("../models/Users");

/**
 * UsersController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  signup: async function (requests, response) {
    try {
      const { value, error } = new Joi.object({
        full_name: Joi.string().min(5).max(50).required(),
        mail: Joi.string().email().required(),
        password: Joi.string().required(),
      }).validate(requests.body);

      if (error) {
        return response.status(400).send({
          error,
        });
      }

      await Users.create(value);

      return response.status(200).send({ message: "User created" });
    } catch (error) {
      throw response.status(500).send({ error });
    }
  },

  login: async function (requests, response) {
    return response.json({});
  },

  recover: async function (requests, response) {
    return response.json({});
  },
};
