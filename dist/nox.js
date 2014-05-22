/** nox.js - v0.0.0 - 2014-05-22
* Copyright (c) 2014 Mauricio Soares de Oliveira;
* Licensed MIT
*/

/**
* @module Nox
*/

;(function(global) {
  'use strict';

  var Nox = function() {
    var args = Nox.methods.toArray(arguments),

      // first arg is the namespace
      ns_string = Nox.methods.getNamespace(args),

      // last arg is the callback, capital letters because it
      // will be invoked as a class with "new"
      Callback = Nox.methods.getCallback(args),

      // defines a dependencies object, where all
      // dependencies are stored to pass in the callback
      dependencies = {},

      // all modules from the args will be stored in here
      modules,

      // the function after aliased and with modules
      fn,

      // used in loopings
      i;

    // gets all modules beeing passed as different args, or as an Array
    modules = Nox.methods.getModules(args);

    // starts all the modules
    for(i = 0; i < modules.length; i += 1) {
      Nox.modules[modules[i]](dependencies);
    }

    // adds the Callback to the namespace
    fn = Nox.methods.namespace(ns_string);
    fn = fn.parent[fn.index] = new Callback(dependencies);

    // if it has initialize, then runs it
    if(fn.initialize) {
      fn.initialize();
    }

    return fn;
  };

  // Adds Nox to the global namespace
  global.Nox = Nox;
} (this));

/**
* Returns the last index of the array, which is the callback
*
* @method getCallback
* @param {Array} arr The array of arguments
* @return {Function} Returns callback
*/
(function(global, Nox) {
  'use strict';
  Nox.methods = Nox.methods || {};

  Nox.methods.getCallback = function(arr) {
    var callback =  arr.pop();

    if(typeof callback !== 'function') {
      throw new Error('Last parameter should be a function');
    }

    return callback;
  };
} (this, this.Nox));

/**
* Gets all modules which the user passed into Nox,
* if there is any
*
* @method getModules
* @param {Array} arr The array of methods
* @return {Array} Returns callback
*/
(function(global, Nox) {
  'use strict';
  Nox.methods = Nox.methods || {};

  Nox.methods.getModules = function(mods) {
  	var modules = [],
      i;

    if(mods[0] && typeof mods[0] === 'string') {
      modules = mods;
    } else if(mods[0] && typeof mods[0] === 'object') {
      modules = mods[0];
    }

    // '*' is passed, gets all modules
    if(modules && modules[0] === '*') {
      modules = [];
      for(i in Nox.modules) {
        modules.push(i);
      }
    }

    // checks if the module exists
    for(i = 0; i < modules.length; i += 1) {
      if(!Nox.modules[modules[i]]) {
        throw new Error('This module doesn\'t exists');
      }
    }

    return modules;
  };
} (this, this.Nox));

/**
* Returns the first index of the array, which is the namespace
*
* @method getNamespace
* @param {Array} arr The array of arguments
* @return {String} Returns the string of the namespace
*/
(function(global, Nox) {
  'use strict';
  Nox.methods = Nox.methods || {};

  Nox.methods.getNamespace = function(arr) {
    var namespace = arr.shift();

    if(typeof namespace !== 'string') {
      throw new Error('First must be a string');
    }

    namespace = namespace.split('.');

    // checks if the string is only a number, or if it starts with a number
    for(var i = 0; i < namespace.length; i += 1) {
      if(!isNaN(namespace[i]) || !isNaN(namespace[i].substring(0, 1))) {
        throw new Error('Any of variables separated by dots can be a number or start with a number');
      }
    }

    return namespace.join('.');
  };
} (this, this.Nox));

/**
* Creates an structure of objects in the global
* namespace
*
* @method namespace
* @param {String} ns_string The string which will be
* converted into objects, must be separated with dots
* @return {Object} Returns the last but one index, and
* the name of the last index
*/
(function(global, Nox) {
  'use strict';
  Nox.methods = Nox.methods || {};

  Nox.methods.namespace = function(ns_string) {
    if(!ns_string || typeof ns_string !== 'string') {
      throw new Error('You need to pass a string');
    }

    var parts = ns_string.split('.'),
      parent = global,
      length = parts.length,
      i;

    for(i = 0; i < length; i += 1) {
      if(i + 1 === length) {
        return {
          parent: parent,
          index: parts[i]
        };
      }

      if(typeof parent[parts[i]] === 'undefined') {
        parent[parts[i]] = {};
      }

      parent = parent[parts[i]];
    }
  };
} (this, this.Nox));

/**
* converts an Array-like to an Array
*
* @method toArray
* @param {Object} obj The object which will be converted
* @return {Array} Returns the converted Array
*/
(function(global, Nox) {
  'use strict';
  Nox.methods = Nox.methods || {};

  Nox.methods.toArray = function(obj) {
    return Array.prototype.slice.call(obj);
  };
} (this, this.Nox));

/**
* A optional Helper for handling Ajax requests
*
* @module ajax
*/

(function(global, Nox) {
  'use strict';
	Nox.modules = Nox.modules || {};

	Nox.modules.ajax = function(box) {
		box.ajax = {};

		/**
		* A request method
		*
		* @method request
		*/
		box.ajax.request = function() {

		};
	};
} (this, this.Nox));

// modules
(function(global, Nox) {
  'use strict';

	Nox.modules = Nox.modules || {};
	Nox.modules.dom = function(box) {
		box.dom = {
			getElement: function() {}
		};
	};
} (this, this.Nox));
// modules
(function(global, Nox) {
  'use strict';

	Nox.modules = Nox.modules || {};
	Nox.modules.events = function(box) {
		box.events = {
			click: function() {}
		};
	};
} (this, this.Nox));