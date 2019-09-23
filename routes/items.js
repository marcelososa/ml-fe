var express = require('express');
var api_caller = require('../utils/api_caller');

var router = express.Router();

// Result list
router.get('/', function(req, res, next) {
    const query = req.query.search;

    if(query) {
        api_caller.api_call(`http://localhost:3000/api/items?q=${query}`)
        .then(response => {
          res.render('product_list',{
              title: `Resultados para: ${query}`,
              query: query,
              model: response
          });
        })
        .catch(error => {
          res.send(error);
        });
    }
});

// Detail view
router.get('/:id', function (req, res, next) {

    api_caller.api_call(`http://localhost:3000/api/items/${req.params.id}`)
        .then(response => {
            res.render('product_details', {
                title: `Detalle de: ${response.item.title}`,
                model: response
            });
        })
        .catch(error => {
            res.send(error);
        });
});

module.exports = router;
