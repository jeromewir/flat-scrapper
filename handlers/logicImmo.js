'use strict';

var cheerio = require('../cheerio');

class LogicImmo {
  parseFlat(body, url, next) {
    var flat = {};
    var $ = cheerio.get(body);

    flat.name = $('.offer-type').text() + ' LogicImmo';
    flat.size = parseInt($('.offer-attributes .offer-area-number').text());
    flat.rooms = parseInt($('.offer-attributes .offer-rooms-number').text());
    flat.price = parseInt($('.main-price').text().replace(' ', ''));
    flat.photos = [];
    flat.url = url;

    $('.thumb-link.thumb img').each(function() {
      flat.photos.push($(this).attr('src').replace(/75x75/g, '800x600'));
    });

    flat.website = 'Logic-Immo';

    return next(null, flat);
  }
}

module.exports = new LogicImmo();