const Joi = require("joi");
const jwt = require("jsonwebtoken");
const { config } = require("dotenv");

config();

module.exports = async function (request, response, next) {
  try {
    const { token, error } = new Joi.string().required().validate(request.headers.token);

    if (error) {
      return response.status(401).send({ error });
    }

    const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
    const user = await Users.findOne({ id: decoded.id });

    if (!user) {
      return response.status(404).send({ message: "User not found" });
    }

    request.user = user;
    next();
  } catch (error) {
    throw response.status(500).send({ error });
  }
};
