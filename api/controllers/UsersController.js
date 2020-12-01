/**
 * UsersController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const Joi = require("joi");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { config } = require("dotenv");

config();

module.exports = {
  signup: async function (request, response) {
    try {
      const { value, error } = new Joi.object({
        full_name: Joi.string().min(3).max(50).required(),
        mail: Joi.string().email().required(),
        password: Joi.string().required(),
      }).validate(request.body);

      if (error) {
        return response.status(400).send({
          error,
        });
      }

      const salt = await bcrypt.genSalt(10);
      value.password = await bcrypt.hash(value.password, salt);

      await Users.create(value);

      return response.status(200).send({ message: "User created" });
    } catch (error) {
      throw response.status(500).send({ error });
    }
  },

  login: async function (request, response) {
    try {
      const { value, error } = new Joi.object({
        mail: Joi.string().email().required(),
        password: Joi.string().required(),
      }).validate(request.body);

      if (error) {
        return response.status(400).send({
          error,
        });
      }

      const user = await Users.findOne({ mail: value.mail });

      if (!user) {
        return response.status(404).send({ message: "User not found" });
      }

      const passwordIsValid = await bcrypt.compare(
        value.password,
        user.password
      );

      if (!passwordIsValid) {
        return response.status(401).send({ message: "Password invalid" });
      }

      const token = jwt.sign({ id: user.id, admin: user.admin }, process.env.TOKEN_SECRET, {
        expiresIn: process.env.TOKEN_EXPIRES,
      });

      return response.status(200).send({
        token,
        full_name: user.full_name,
        mail: user.mail,
      });
    } catch (error) {
      throw response.status(500).send({ error });
    }
  },

  recover: async function (requests, response) {
    return response.json({});
  },
};
