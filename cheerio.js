'use strict';

var cheerio = require('cheerio');

class Cheerio {
  get(body) {
    var $ = cheerio.load(body, {
      normalizeWhitespace: true
    });

    return $;
  }
}

module.exports = new Cheerio();