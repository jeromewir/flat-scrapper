'use strict';

var cheerio = require('../cheerio');

class GuyHoquet {
  parseFlat(body, url, next) {
    var flat = {};
    var $ = cheerio.get(body);

    flat.name = $('.fiche-technique .col-md-12 h2').text();
    flat.price = parseInt($('.rub .detail .dd').text().replace(' ', ''));
    flat.url = url;
    flat.website = 'Guy Hoquet';

    $('.fiche-technique .detail table table tr').each(function() {
      var tds = $(this).find('td');
      if (tds.length == 2) {
        var name = $(tds[0]).text();
        var val = $(tds[1]).text();
        if (name == 'Surface habitable :') flat.size = parseInt(val);
        if (name == 'Nombre de pièces :') flat.rooms = parseInt(val);
      }
    });

    next(null, flat);
  }
}

module.exports = new GuyHoquet();
