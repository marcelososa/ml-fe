var express = require('express');
var api_caller = require('../utils/api_caller');
var builder = require('../utils/items_builder');

var router = express.Router();

// Result list
router.get('/', function (req, res, next) {
  const query = req.query.q;
  const endpoint = `https://api.mercadolibre.com/sites/MLA/search?q=${query}`;

  let results = {};

  api_caller.api_call(endpoint)
    .then(response => {
      results = builder.getResultsList(response);

      return builder.getCurrencyData(response.results[0].currency_id);
    })
    .then(currencyResponse => {
      results.items.forEach(item => {
        item.price.currency = currencyResponse.currency;
        item.price.decimals = currencyResponse.decimals;
        item.price.symbol = currencyResponse.symbol;
      });

      res.json(results);
    })
    .catch(error => {
      res.send(error);
    });
});

// Product details
router.get('/:id', function (req, res, next) {
  const productId = req.params.id;
  const endpoints = {
    product: `https://api.mercadolibre.com/items/${productId}`,
    description: `https://api.mercadolibre.com/items/${productId}/description`
  };

  let callToItem = api_caller.api_call(endpoints.product)
    .then(response => {
      return response;
    })
    .catch(error => {
      throw error;
    });

  let callToDescription = api_caller.api_call(endpoints.description)
    .then(response => {
      return response.plain_text;
    })
    .catch(error => {
      throw error;
    });

  let result = {};
  let currencyId = null;
  let categoryId = null;

  Promise.all([callToItem, callToDescription])
    .then(values => {
      currencyId = values[0].currency_id;
      categoryId = values[0].category_id;

      result = builder.getItemDetail(values[0], values[1]);

      return result;
    })
    .then(response => {
      return Promise.all([
        builder.getCurrencyData(currencyId), 
        builder.getCategoriesFromId(categoryId)
      ]);
    })
    .then(response => {
      result.item.price.currency = response[0].currency;
      result.item.price.symbol = response[0].symbol;
      result.item.price.decimals = response[0].decimals;
      result.categories = response[1];

      res.json(result);
    })
    .catch(error => res.send(error));
});

module.exports = router;
