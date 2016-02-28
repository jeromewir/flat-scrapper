'use strict';

var cheerio = require('../cheerio');

class Foncia {
  parseFlat(body, url, next) {
    var flat = {};
    var $ = cheerio.get(body);

    flat.name = $('h1.OfferTop-title').text();
    flat.price = parseInt($('.OfferTop-price').text().replace(/ /g, ''));
    flat.url = url;
    flat.website = 'Foncia';

    var $infos = $('.MiniData-row p');
    flat.size = parseInt($($infos[0]).text());
    flat.rooms = parseInt($($infos[1]).text());
    flat.photos = [];

    $('.OfferSlider-main-item img').each(function() {
      flat.photos.push($(this).attr('src'));
    });

    next(null, flat);
  }
}

module.exports = new Foncia();
