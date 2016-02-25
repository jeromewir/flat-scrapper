var express = require('express');
var cheerio = require('cheerio');
var request = require('request');

var app = express();
var url = 'http://www.seloger.com/annonces/achat/appartement/paris-3eme-75/sainte-avoie/106557281.htm?ci=750102,750103,750111,750112,750115&etagemin=1&idtt=2&org=advanced_search&pxmax=350000&pxmin=300000&bd=Li_LienAnn_1';

request.get({
    url: url,
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.8; rv:24.0) Gecko/20100101 Firefox/24.0'
    }
  }, function(error, response, body) {
  var $ = cheerio.load(body, {
    normalizeWhitespace: true
  });

  // console.log(body);
  var name = $('.title_capsule .detail-title').text();
  var price = $('#price').text();
  var additionalData = [];
  $('.resume__critere').each(function(i, elem) {
    additionalData.push($(this).text());
  });

  console.log(name, price, additionalData);
});

app.listen(3000, function() {
  console.log('App is listening');
});