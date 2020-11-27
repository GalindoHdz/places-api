const Joi = require('joi');
const jwt = require('jsonwebtoken');
const { config } = require('dotenv');

config();

module.exports = async function(request, response, next) {
  try {
    const { value, error } = new Joi.object({
      token: Joi.string().required()
    }).validate(request.body);

    if (error) {
      return response.status(401).send({error});
    }

    const decoded = jwt.verify(value.token, process.env.TOKEN_SECRET);
    const user = await Users.findById(decoded.id);

    if(!user) {
      return response.status(404).send({ message: 'User not found' });
    }

    request.user = user;
    next();
  } catch (error) {
    // console.log(error);
    throw response.status(500).send({ error });
  }
}