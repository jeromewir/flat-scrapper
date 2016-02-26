var express = require('express');
var cheerio = require('cheerio');
var request = require('request');
var _ = require('lodash');
var iconv = require('iconv-lite');

var handlers = {
  seloger: require('./handlers/seloger'),
  pap: require('./handlers/pap'),
  leboncoin: require('./handlers/leboncoin'),
  'logic-immo': require('./handlers/logicImmo')
};

var app = express();
var url = 'http://www.seloger.com/annonces/achat/appartement/paris-3eme-75/sainte-avoie/106557281.htm?ci=750102,750103,750111,750112,750115&etagemin=1&idtt=2&org=advanced_search&pxmax=350000&pxmin=300000&bd=Li_LienAnn_1';
//var url = 'http://www.pap.fr/annonce/vente-appartement-maison-paris-12e-g37779g37781g37782-a-partir-du-2-pieces-entre-330000-et-350000-euros-r409801539';
//var url = 'https://www.leboncoin.fr/ventes_immobilieres/929907062.htm?ca=12_s';
//var url = 'http://www.logic-immo.com/detail-vente-ac5c8147-f7c8-2172-f8b1-1528147a7864.htm';

function handleFlat(url, body) {
  var keys = _.keys(handlers);

  for (var i = 0; i < keys.length; ++i) {
    var key = keys[i];
    if (url.match(key)) {
      handlers[key].parseFlat(body, addFlat);
    }
  }
}

function addFlat(err, flat) {
  console.log(err, flat);
}

request.get({
    url: url,
    encoding: null,
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.8; rv:24.0) Gecko/20100101 Firefox/24.0'
    }
  }, function(err, response, body) {
    if (err) return console.error(err);
    handleFlat(url, url.match('seloger') ? body : iconv.decode(new Buffer(body), 'ISO-8859-1'));
});

app.use(express.static('app'));

app.listen(3000, function() {
  console.log('App is listening');
});