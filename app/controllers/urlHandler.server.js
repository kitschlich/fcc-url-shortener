'use strict';

var validator = require('validator');

function urlHandler (db) {
    
    var urls = db.collection('urls');

    this.fetchShortURL = function (req, res) {
        var longURL = req.params.url,
            host = req.headers.host,
            urlValid = validator.isURL(longURL, {require_protocol: true}),
            allowInvalid = req.query.allow;
            
        if (!urlValid && (allowInvalid !== 'true')) {
            res.json('Invalid URL');
            return;
        }
            
        urls.findOne({"original_url": longURL}, {_id: false, "url_id": false}, function(err, result){
            if (err) throw err;
            if (result) {
                res.json(result);
            } else {
                insertNewURL(longURL, host, res);
            }
        });
    };
    
    function insertNewURL(longURL, host, res) {
        urls.count(function(err, count){
            if (err) throw err;
            var urlData = {
                "original_url": longURL,
                 "short_url": host + "/" + count,
                 "url_id": count
            };
            urls.insert(urlData, function(err){
                if (err) throw err;
                urls.findOne({"original_url": longURL}, {_id: false, "url_id": false}, function(err, doc){
                    if (err) throw err;
                    res.json(doc);
                });
            });
        });
    }
    
    this.redirectToURL = function (req, res) {
      var url_id = req.params.url_id; 
      urls.findOne({"url_id": Number(url_id)}, function(err, doc){
          if (err) throw err;
          if (validator.isURL(doc.original_url, {require_protocol: true})) {
            res.redirect(doc.original_url);
          } else {
              res.send('Error: Shortened URL points to an invalid URL. Be sure to include the protocol (http://)');
          }
      });
    };
}

module.exports = urlHandler;