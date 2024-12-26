const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const { Url } = require('../models');
const { UrlSerializer } = require('../serializer/url.serializer');

/**
 *
 * @param {object} body
 * @returns {Promise<shortUrl>}
 */
const createUrl = async (body) => {
  const { longUrl, customAlias } = body;
  if (customAlias) {
    const existAlias = await Url.findOne({ customAlias });
    if (existAlias) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Custom alias already exit!');
    }
  }
   // Check if there's already a short URL for this long URL
   const existingUrl = await Url.findOne({ longUrl });
   if (existingUrl) {
     return UrlSerializer.serialize(existingUrl); // Return the existing short URL if already generated
   }
  // Use the model's method to generate a short URL
  const url = new Url();
  const newUrl = await url.generateShortUrl(longUrl);

  // Attach custom alias if provided
  if (customAlias) {
    newUrl.customAlias = customAlias;
  }
  const res = await newUrl.save();
  return UrlSerializer.serialize(res);
};

/**
 *
 * @param {*} shortUrl
 * @returns {Promise<object>}
 */

const redirectLongUrl = async (query) => {
  if (query) {
    const response = await Url.findOne(query);
    if (!response) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Provided short url not found');
    }

    //   increment visit count
    await response.incrementVisitCount();
    return UrlSerializer.serialize(response, { stats: 'stats' });
  }
};

/**
 *
 * @param {*} options
 * @returns <Promises></Promises>
 */

const getAllUrls = async (filter, options) => {
  const urls = await Url.paginate(filter, options);
  return urls;
};

module.exports = {
  createUrl,
  redirectLongUrl,
  getAllUrls,
};
