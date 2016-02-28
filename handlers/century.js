'use strict';

var cheerio = require('../cheerio');

class Century {
  parseFlat(body, url, next) {
    var flat = {};
    var $ = cheerio.get(body);

    flat.name = $('.h1_page').text();
    flat.price = parseInt($('.tarif b').text().replace(' ', ''));
    flat.url = url;
    $('.box li').each(function() {
      var title = $(this).find('.titreDetail');

      if (title.text() == 'Surface totale') {
        $(this).find('span').remove();
        flat.size = parseInt($(this).text().slice(3));
      }

      title.find('.posL').remove();
      if (title.text() == ' Nombre de pièces :') {
        $(this).find('span').remove();
        flat.rooms = parseInt($(this).text());
      }
    });

    flat.photos = [];
    flat.photos.push($('#imgPrint').find('img').attr('src'));

    flat.website = 'Century';

    next(null, flat);
  }
};

module.exports = new Century();