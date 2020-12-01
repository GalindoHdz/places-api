const Joi = require("joi");
const jwt = require("jsonwebtoken");
const { config } = require("dotenv");

config();

module.exports = async function (request, response, next) {
  try {
    const { value, error } = new Joi.object({
      token: Joi.string().required()
    }).validate({ token: request.headers.token});

    if (error) {
      return response.status(401).send({ error });
    }

    const decoded = jwt.verify(value.token, process.env.TOKEN_SECRET);

    if(!decoded.admin){
      return response.status(401).send({ message: "User not authorized" });
    }

    const user = await Users.findOne({ id: decoded.id });

    if (!user) {
      return response.status(404).send({ message: "User not found" });
    }

    if(!user.admin){
      return response.status(401).send({ message: "User not authorized" });
    }

    request.user = user;
    next();
  } catch (error) {
    throw response.status(500).send({ error });
  }
};
