let BASE_URL = process.env.BASE_URL;
class UrlSerializer {
  static serialize(url, options = {}) {
    const data = {
      longUrl: url.longUrl,
      shortUrl: BASE_URL + url.shortUrl,
    };
    if (options.stats) {
      data.expirationDate = url.expirationDate;
      data.isActive = url.isActive;
      data.customAlias = url.customAlias;
      data.tags = url.tags;
      data.visitCount = url.visitCount;
    }
    if (options.includeTimestamps) {
      data.createdAt = url.createdAt;
      data.updatedAt = url.updatedAt;
    }

    return data;
  }
  static serializeList(urls, options = {}) {
    return urls.map((url) => UrlSerializer.serialize(url, options));
  }
}

module.exports = {
  UrlSerializer,
};
