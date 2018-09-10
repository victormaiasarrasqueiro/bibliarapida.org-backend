var elastic_query = require('./public/v1/elastic_query');

module.exports = function(app) {

    app.use('/api/elastic/query', elastic_query);

};