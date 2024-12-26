const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { urlService, userService } = require('../services');
const pick = require('../utils/pick');

const createUrl = catchAsync(async (req, res) => {
  const url = await urlService.createUrl(req.body);
  res.status(httpStatus.CREATED).send(url);
});

const redirectLongUrl = catchAsync(async (req, res) => {
  const query = pick(req.query, ['shortUrl']);
  const response = await urlService.redirectLongUrl(query);
  return res.redirect(response.longUrl);
  res.status(httpStatus.CREATED).send(response);
});

const getAllUrls = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'role']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const response = await urlService.getAllUrls(filter,options);

  res.send(response);
});
module.exports = {
  createUrl,
  redirectLongUrl,
  getAllUrls,
};
