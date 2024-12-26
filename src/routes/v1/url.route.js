const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const userValidation = require('../../validations/url.validation');
const urlController = require('../../controllers/url.controller');
// initialize express router
const router = express.Router();

router
  .route('/')
  .post(validate(userValidation.createUrl), urlController.createUrl)
  .get(validate(userValidation.redirectUrl), urlController.redirectLongUrl);
router.route('/all').get(urlController.getAllUrls);
module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Url
 *   description: Url management and retrieval
 */

/**
 * @swagger
 * /url:
 *   post:
 *     summary: Create a short url
 *     description: Only admins can get other urls.
 *     tags: [Url]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - longUrl
 *               - customAlias
 *             properties:
 *               longUrl:
 *                 type: string
 *               customAlias:
 *                 type: string
 *                 description: must be unique
 *             example:
 *               longUrl: https://arslantoor.com/someurlserviekjdnclkjnec
 *               customAlias: myurl
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Url'
 *       "400":
 *         $ref: '#/components/responses/DuplicateUrl'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *   get:
 *     summary: Redirect to long url
 *     description: Only admins can retrieve all urls.
 *     tags: [Url]
 *     parameters:
 *       - in: query
 *         name: shortUrl
 *         schema:
 *           type: string
 *         description: Provide short url here without domain
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Url'
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 limit:
 *                   type: integer
 *                   example: 10
 *                 totalPages:
 *                   type: integer
 *                   example: 1
 *                 totalResults:
 *                   type: integer
 *                   example: 1
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */
/**
 * @swagger
 * /url/all:
 *   get:
 *     summary: Get all urls
 *     description: Logged in users can fetch only their own user information. Only admins can fetch other users.
 *     tags: [Url]
 *     parameters:
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: sort by query in the form of field:desc/asc (ex. name:asc)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *         default: 10
 *         description: Maximum number of users
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Url'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */
