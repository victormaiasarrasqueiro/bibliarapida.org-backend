"use strict";

var express = require('express');
var router = express.Router();

var elasticsearch = require('elasticsearch');

var client = new elasticsearch.Client({
    host: 'localhost:9200',
    log: 'trace'
});

// 1 - Match All 
router.get('/match_all/:text/:from/:size', function(req, res) {

    client.search({
        index: 'biblia',
        type: 'versiculo',
        from:req.params.from,
        size:req.params.size,
        body: {
            sort : [
                "id_livro","cap","ver"
            ],
            query: {
                match_all: {}
            },
            highlight: {
                fields : {
                    "text" : {"pre_tags" : ["<b>"], "post_tags" : ["</b>"] }
                }
            },
            aggs : { 
                livros : { 
                    terms : { 
                      field : "id_livro"
                    }
                }
            }
        }//fim do body
      }).then(function (resp) {
        res.json(resp);
      }, function (err) {
        res.json(err);
      });

});

// 2 - Match
router.get('/match/:text/:livro/:from/:size/:ordernacao', function(req, res) {

    let ordernacao = [
        "_score"
    ];

    if(req.params.ordernacao && req.params.ordernacao == 1){
        ordernacao = [
            "id_livro",
            "cap",
            "ver"
        ]
    }

    let objectQuery = {
        "bool" : {
            "must" : {
                "match" : {
                    "text":{
                        "query" : req.params.text,
                        "operator" : "and"
                    }
                }
            }
        }

    };

    if(req.params.livro && req.params.livro != -1 ){
        objectQuery.bool.filter = {
            "term" : { "id_livro" : req.params.livro }
        };
    }

    client.search({
        index: 'biblia',
        type: 'versiculo',
        from:req.params.from,
        size:req.params.size,
        body: {
            sort : ordernacao,
            query: objectQuery,
            highlight: {
                fields : {
                    "text" : {"pre_tags" : ["<mark>"], "post_tags" : ["</mark>"], "type" : "plain", "force_source" : true}
                }
            },
            aggs : { 
                livros : { 
                    terms : { 
                      field : "id_livro"
                    }
                }
            }
        }//fim do body
      }).then(function (resp) {
        res.json(resp);
      }, function (err) {
        res.json(err);
      });

});

// Export
module.exports = router;