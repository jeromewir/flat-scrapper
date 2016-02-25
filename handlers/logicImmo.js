'use strict';

var cheerio = require('../cheerio');

class LogicImmo {
  parseFlat(body, next) {
    var flat = {};
    var $ = cheerio.get(body);

    flat.name = $('.offer-type').text() + ' LogicImmo';
    flat.size = parseInt($('.offer-attributes .offer-area-number').text());
    flat.rooms = parseInt($('.offer-attributes .offer-rooms-number').text());
    flat.price = parseInt($('.main-price').text().replace(' ', ''));
    flat.photos = [];

    $('.thumb-link.thumb img').each(function() {
      flat.photos.push($(this).attr('src').replace(/75/g, '800'));
    });

    return next(null, flat);
  }
}

module.exports = new LogicImmo();