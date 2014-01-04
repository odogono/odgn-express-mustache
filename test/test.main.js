var assert = require('assert'),
    express = require('express'),
    expressMustache = require('../'),
    fs = require('fs');

describe('odgn-express-mustache', function(){

    it('should render from a file', function(done){
        var app = express();
        app.set( 'views', __dirname + '/fixtures');
        app.engine( 'html', expressMustache );
        app.locals.user = { name: 'tobi' };

        app.render('user.html', function(err, str){
            if (err) return done(err);
            assert.equal( str, '<p>tobi</p>');
            done();
        });
    });

    it('should render a partial from a file', function(done){
        var app = express();
        app.set( 'views', __dirname + '/fixtures');
        app.engine( 'html', expressMustache );
        app.locals.user = { name: 'alex' };

        app.render('partial.html', function(err,str){
            if (err) return done(err);
            assert.equal( str, '<p>alex</p>');
            done();    
        });
    });

});