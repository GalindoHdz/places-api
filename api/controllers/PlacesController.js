/**
 * PlacesController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const Joi = require('joi');

module.exports = {
  find: async function (request, response) {
    try {
      const lists = await Places.find({ user: request.user.id });

      return response.status(200).send({ lists });
    } catch (error) {
      throw response.status(500).send({ error });
    }
  },

  create: async function (request, response) {
    try {
      const { value, error } = new Joi.object({
        name: Joi.string().required(),
        description: Joi.string(),
        list: Joi.array().items({
          name: Joi.string().required(),
          latitude: Joi.string().required(),
          longitude: Joi.string().required(),
        }),
      }).validate(request.body);

      if (error) {
        return response.status(400).send({
          error,
        });
      }

      value.user = request.user.id;

      await Places.create(value);

      return response.status(200).send({ message: 'Place list created' });
    } catch (error) {
      throw response.status(500).send({ error });
    }
  },

  update: async function (request, response) {
    try {
      const { value, error } = new Joi.object({
        id: Joi.string().required(),
        name: Joi.string().required(),
        description: Joi.string(),
        list: Joi.array().items({
          name: Joi.string().required(),
          latitude: Joi.string().required(),
          longitude: Joi.string().required(),
        }),
      }).validate(request.body);

      if (error) {
        return response.status(400).send({ error });
      }

      await Places.update({ id: value.id }).set({ ...value });

      return response.status(200).send({ message: 'Place list updated' });
    } catch (error) {
      throw response.status(500).send({ error });
    }
  },

  destroy: async function (request, response) {
    try {
      await Places.destroy({ id: request.params.id });

      return response.status(200).send({ message: 'list deleted' });
    } catch (error) {
      throw response.status(500).send({ error });
    }
  },
};
