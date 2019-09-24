const ENDPOINTS = {
    LOCAL_API_ITEMS_QUERY: 'http://localhost:3000/api/items?q=$1',
    LOCAL_API_ITEMS_ID: 'http://localhost:3000/api/items/$1',
    ML_API_ITEMS_QUERY: 'https://api.mercadolibre.com/sites/MLA/search?q=$1',
    ML_API_ITEMS_ID: 'https://api.mercadolibre.com/items/$1',
    ML_API_ITEMS_DESCRIPTION: 'https://api.mercadolibre.com/items/$1/description',
    ML_API_CURRENCIES: 'https://api.mercadolibre.com/currencies/$1',
    ML_API_CATEGORIES: 'https://api.mercadolibre.com/categories/$1'
}

module.exports = ENDPOINTS;