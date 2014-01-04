var fs = require('fs');
var Mustache = require( 'mustache' );
var path = require('path');

(function(){
    var viewPath, partialExt, templateCache = {};

    var partialsRenderer = function( partialName ){
        var name = path.join( viewPath, partialName + partialExt );
        return fs.readFileSync( name, 'utf8');
    };

    var render = function( name, options, callback ) {
        if( !viewPath ) 
            viewPath = options.settings.views;
        if( !partialExt ) 
            partialExt = path.extname( name );

        // if the view cache is enabled, then there is chance the template
        // will be in the cache, otherwise load it from file
        if( !templateCache[name] ){ // || !app.enabled('view cache') ){
            return fs.readFile(name, 'utf8', function(err, templateString){
                if (err) return callback(err);
                try {
                    // log.debug('compiling ' + templateString );
                    Mustache.parse(templateString);
                    var renderFn = function(options){
                        if( options.debug ){
                            console.log('rendering ' + name);
                            console.log( options );
                        }
                        return Mustache.render( templateString, options, partialsRenderer );
                    }
                    templateCache[name] = renderFn;
                    return callback(null, renderFn(options) );
                }
                catch(err) {
                    return callback(err);
                }
            });
        } else {
            if( options.cb )
                return options.cb(null, templateCache[name] );
            return callback(null, templateCache[name](options) );
        }
    };

    module.exports = render;
}).call(this);



// var ExpressMustache = function(){
//     this.__express = middleware.bind(this);
// };



// function middleware(filename, options, cb) {
    
// }


// module.exports = new ExpressMustache();
// module.exports.create = function() {
//     return new ExpressMustache();
// };

/*

// app.set('view engine', 'mustache');

// hack in partials support
var existing = Mustache.Writer.prototype._partial;
Mustache.Writer.prototype._partial = function(name,context){    
    // load the partial from file if the partial doesn't exist or the view cache is disabled
    if( !this._partialCache[name] || !app.enabled('view cache') ){
        var partialRaw = fs.readFileSync( path.join(app.settings.partials,name+'.mustache'), 'utf8');
        Mustache.parse( partialRaw );
    }
    return existing.apply( this, arguments );
};


var partialsRenderer = function( partialName ){
    Mustache.partialCache = Mustache.partialCache || {};
    console.log('partial render ' + partialName );
    return "";
}
// 
// Returns a partial rendered into a string with the given options (as well as app.locals)
// 
app.partial = function(path, options){
    var locals = _.extend({}, this.locals, options );
    return Mustache.render( '{{>' + path + '}}', locals );
}

app.engine('mustache', function(path, options, callback){
    Mustache.templateCache = Mustache.templateCache || {};

    // if the view cache is enabled, then there is chance the template
    // will be in the cache, otherwise load it from file
    if( !Mustache.templateCache[path] || !app.enabled('view cache') ){
        fs.readFile(path, 'utf8', function(err, templateString){
            if (err) return callback(err);
            try {
                // log.debug('compiling ' + templateString );
                Mustache.parse(templateString);
                var renderFn = function(options){
                    console.log('rendering ' + path);
                    console.log( arguments );
                    return Mustache.render( templateString, options, partialsRenderer );
                }
                Mustache.templateCache[path] = renderFn;
                return callback(null, renderFn(options) );
            }
            catch(err) {
                return callback(err);
            }
        });
    } else {
        if( options.cb )
            options.cb(null, Mustache.templateCache[path] );
        else
            callback(null, Mustache.templateCache[path](options) );
    }
    // TODO - enable some kind of caching   
});//*/