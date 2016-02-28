'use strict';

var cheerio = require('../cheerio');

class LeBonCoin {
  parseFlat(body, url, next) {
    var flat = {};
    var $ = cheerio.get(body);

    flat.name = $('#ad_subject').text();
    flat.price = parseInt($('td .price').attr('content'));
    flat.url = url;

    $('.criterias tr').each(function(i, item) {
      var name = $(this).find('th').text().toLowerCase();
      var value = $(this).find('td').text();

      if (name.match('pièces')) flat.rooms = parseInt(value);
      if (name.match('surface')) flat.size = parseInt(value);
    });

    flat.photos = [];

    $('.lbcImages meta').each(function(i, item) {
      var value = $(this).attr('content');
      flat.photos.push('http://' + value.substr(2));
    });

    flat.website = 'Le bon coin';

    next(null, flat);
  }
};

module.exports = new LeBonCoin();