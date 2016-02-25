'use strict';

var cheerio = require('../cheerio');
var _ = require('lodash');

class Pap {
  parseFlat(body, next) {
    var $ = cheerio.get(body);
    var flat = {};
    var reg = /\d./g;

    flat.name = $('.header-descriptif .title').text();
    flat.price = parseInt($('.header-descriptif .prix').text().replace('.', ''));

    $('.footer-descriptif li').each(function(i, item) {
      $(this).find('span').remove();
      var value = $(this).text();
      switch (i) {
        case 0:
          flat.rooms = parseFloat(value);
          break;
        case 2:
          flat.size = parseFloat(value)
      }
    });

    flat.photos = [];

    $('.showcase-thumbnail img').each(function(i, item) {
      flat.photos.push($(this).attr('src'));
    });

    return next(null, flat);
  }
};

module.exports = new Pap();