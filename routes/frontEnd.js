
/*
 * Browser routing, for clients
 */
var fs = require('fs')
    , request = require('request')
    , config = JSON.parse(fs.readFileSync('./static/config.json'))
    , aglio = require('aglio')
    , blueprint = fs.readFileSync('./static/blueprint.md').toString()
    , colored = require('../lib/colored')
    , schemer = require('../lib/schemer')
    , cutils = require('../lib/cutils')
    , gadget = require('../lib/gadget')
    , ua = 'UA-37125372-13'
    , ga = new gadget(ua, 'www.thecolorapi.com')
    , newTime
    , response;

module.exports = function (app, ensureAuth) {
  app.get('/', function(req, res) {
    res.render('index', { title: config.name,
                          req: req 
                        });
  });

  app.get('/about', function(req, res) {
    res.render('about', { title: config.name,
                          req: req 
                        });
  });

  app.get('/docs', function(req, res) {
    var template = './static/flatly.jade';
    aglio.render(blueprint, template, function (err, html, warnings) {
        if (err) return console.log(err);
        if (warnings) console.log(warnings);
        res.send(html);
        ga.collectPageview(req,null);
    });
  });

  app.get('/form-id', function(req, res) {
    res.render('formId',  { 
                            title: config.name,
                            req: req 
                          });
  });

  app.post('/form-id', function(req,res){
    var err = null,
      color = colored.colorMe.apply(this,[cutils.parseUnknownType(req.body.color)]),
      topKeys = color ? Object.keys(color) : null,
      lowKeys = color ? (function(){
        var obj = {};
        for (var i = 0; i < topKeys.length; i++) {
          obj[topKeys[i]] = Object.keys(color[topKeys[i]]);
        }
        return obj;
      })() : null;
    if (color){
      res.redirect('/id?format=html&hex=' + color.hex.clean);
    } else {
      res.render('400', { color: req.body.color });
    }
  });

  app.get('/form-scheme', function(req, res) {
    res.render('schemeId',  { 
                            title: config.name,
                            req: req 
                          });
  });

  app.post('/scheme-id', function(req,res){
    var err = null,
      color = colored.colorMe.apply(this,[cutils.parseUnknownType(req.body.color)]),
      topKeys = color ? Object.keys(color) : null,
      lowKeys = color ? (function(){
        var obj = {};
        for (var i = 0; i < topKeys.length; i++) {
          obj[topKeys[i]] = Object.keys(color[topKeys[i]]);
        }
        return obj;
      })() : null;
    if (color){
      res.redirect('/scheme?format=html&hex=' + color.hex.clean + '&mode=' + req.body.mode);
    } else {
      res.render('400', { color: req.body.color });
    }
  });

};