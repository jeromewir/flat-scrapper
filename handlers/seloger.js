'use strict';

var cheerio = require('cheerio');
var _ = require('lodash');

class SeLoger {
  parseFlat(body, url, next) {
    var $ = cheerio.load(body, {
      normalizeWhitespace: true,
    });

    var name = $('.title_capsule .detail-title').text();
    var price = $('#price').text();
    var size;
    var rooms;
    $('.resume__critere').each(function() {
      var d = $(this).text();
      if (d.match('m²')) size = d;
      else if (d.toLowerCase().match('pièce')) rooms = parseInt(d);
    });

    var imgs = [];
    $('#slider1').each(function() {
      var img = $(this).find('li img');
      _.forEach(img, i => {
        imgs.push($(i).attr('src'));
      });
    });

    return next(null, {
      name: name,
      price: parseInt(price.replace(/\s+/g, '')),
      size: parseInt(size),
      rooms: rooms,
      photos: imgs,
      url: url,
      website: 'Se Loger',
    });
  }
}

module.exports = new SeLoger();