var api_caller = require('./api_caller');

const getCurrencyData = function(currencyId) {
    const endPoint = `https://api.mercadolibre.com/currencies/${currencyId}`;

    return api_caller.api_call(endPoint)
    .then(response => {
        return {
            symbol: response.symbol, 
            decimals: response.decimal_places,
            currency: response.id
          };
    })
    .catch(error => {
      throw error;
    });
};

const getItemDetail = function(item, description) {
    let itemDetail = {
        author: {
            name: '¯\_(ツ)_/¯',
            lastname: ''
        },
        item: {
            id: item.id,
            title: item.title,
            price: {
                currency: '',
                amount: item.price,
                decimals: 0,
                symbol: ''
            },
            picture: (item.pictures.length) ? item.pictures[0].url : '',
            condition: item.condition,
            free_shipping: item.shipping.free_shipping,
            sold_quantity: item.sold_quantity,
            description: description
        },
        categories: []
    };

    return itemDetail;
};

const getCategoriesFromId = function(categoryId) {
    const endPoint = `https://api.mercadolibre.com/categories/${categoryId}`;

    return api_caller.api_call(endPoint)
    .then(response => {
      return response.path_from_root;
    })
    .catch(error => {
      throw error;
    });
};

const getCategoriesFromQuery = function(data) {
    let res = [];
    
    if (data.length && data[0].id === 'category' && data[0].values.length){
        res = data[0].values[0].path_from_root;
    }
    return res;
};

const getItems = function(data) {
    let res = [];

    for(let x=0; x<data.length && x<4; x++) {
        res.push({
            id: data[x].id,
            title: data[x].title,
            price: {
                currency: '',
                amount: data[x].price,
                decimals: 0,
                symbol: ''
            },
            picture: data[x].thumbnail,
            condition: data[x].condition,
            free_shipping: data[x].shipping.free_shipping,
            location: data[x].seller_address.city.name + ', ' + data[x].seller_address.state.name
        });
    }

    return res;
};

const getResultsList = function(data) {
    let listProducts = {
        author: {
            name: '',
            lastname: ''
        },
        categories: getCategoriesFromQuery(data.filters),
        items: (data.results.length) ? getItems(data.results) : []
    };

    return listProducts;
};

module.exports = {
    getItemDetail: getItemDetail,
    getCurrencyData: getCurrencyData,
    getResultsList: getResultsList,
    getCategoriesFromId: getCategoriesFromId
};