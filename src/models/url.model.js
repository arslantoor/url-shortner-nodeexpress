const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');
const crypto = require('crypto');

const urlSchema = mongoose.Schema(
  {
    longUrl: {
      type: String,
      required: true,
      trim: true,
      validate(value) {
        const urlRegex = /^(https?:\/\/)[\w.-]+(?:\.[\w.-]+)+[\w\-\._~:/?#[\]@!$&'()*+,;=.]+$/;
        if (!urlRegex.test(value)) {
          throw new Error('Invalid URL format');
        }
      },
    },
    shortUrl: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
    visitCount: {
      type: Number,
      default: 0,
    },
    expirationDate: {
      type: Date,
      default: null,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    customAlias: {
      type: String,
      trim: true,
      unique: true,
      sparse: true, // Ensures customAlias is unique if provided
    },
    tags: {
      type: [String],
      default: [],
    },
    salt: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Add Plugins
urlSchema.plugin(toJSON);
urlSchema.plugin(paginate);

/**
 * Increment shortUrl visit count
 * @return {Promise<void>}
 */
urlSchema.methods.incrementVisitCount = async function () {
  this.visitCount += 1;
  await this.save();
};

/**
 * Check if the URL is expired
 * @returns {Boolean}
 */
urlSchema.methods.isExpired = function () {
  return this.expirationDate && this.expirationDate < Date.now();
};

/**
 * Generate unique short URL
 * Combines hashing and collision detection for scalability
 */
urlSchema.methods.generateShortUrl = async function (longUrl) {
  // Import nanoid for Base62 encoding
  const { customAlphabet } = await import('nanoid');
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const nanoid = customAlphabet(alphabet, 6);

  // Generate a base hash using crypto
  const hash = crypto.createHash('sha256').update(longUrl).digest('hex');

  // Add salt to hash for increased unpredictability
  const salt = crypto.randomBytes(16).toString('hex'); // 16 bytes salt
  const hashWithSalt = crypto
    .createHash('sha256')
    .update(hash + salt)
    .digest('hex');

  // Generate a short URL with nanoid
  let shortUrl = nanoid();

  // Access the model using `this.constructor` to check for short URL collisions
  while (await this.constructor.findOne({ shortUrl })) {
    shortUrl = nanoid(); // If it exists, generate a new one
  }

  // Set the fields for the current instance
  this.longUrl = longUrl;
  this.shortUrl = shortUrl;
  this.salt = salt;

  // Save the document
  await this.save();
  return this;
};

const Url = mongoose.model('Url', urlSchema);

module.exports = Url;
