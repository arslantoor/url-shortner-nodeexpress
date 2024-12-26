const Joi = require('joi');
const { query } = require('../config/logger');

const createUrl = {
  body: Joi.object().keys({
    longUrl: Joi.string().required(),
    customAlias: Joi.string(),
  }),
};

const redirectUrl = {
  query: Joi.object().keys({
    shortUrl: Joi.string().required(),
  }),
};
const getUrls = {
  query: Joi.object().keys({
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};
module.exports = {
  createUrl,
  redirectUrl,
  getUrls,
};
