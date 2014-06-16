# Nox.js

Nox.js helps you defining namespaces, injecting your dependencies (if any), using decorators, emitting events and modularizing your application.

It does't need jQuery or any third-part library, although you can use any with no problems.

## Usage

Creating namespaces is easy:

``` js
Nox('App', function(App) {
  App.fn.foo = function() {};

  // An alternate way to do this is to use prototype
  // App.prototype.foo = function() {};
});

var myInstanceOfApp = new App();

```

As simple as that... you just created a simple var called `App`, which is a constructor, and `myInstanceOfApp` is (as the variable says) an instance of App, and contains a `foo` method attached to it's prototype (`fn` stands to prototype, you can use `prototype` instead of `fn` if you will).

Let`s get further...

### Deeper Namespaces

You can create some namespaces like this:

``` js
Nox('App', function(App) {
  App.fn.foo = function() {};
}); // creates App

Nox('App.Home', function(Home) {
  Home.fn.Home = function() {}
}); // creates App.Home
```

It dinamically creates your namespaces, respecting the previous ones already created.

So you will have both the `App` constructor and `App.Home` constructor.

### Initialize

When you have an `initialize` method attached to the `fn`, it is automatically called when a new instance is created:

``` js
Nox('App', function(app) {
  app.fn.initialize = function() {
    console.log('Initialized');
  }
});

new App(); // Initialized
```

If you want to pass parameters to your instance, you can do this though `initialize`, all parameters you pass into your instance will be acepted as arguments into your `initialize` method, example:

``` js
Nox('App', function(app) {
  app.fn.initialize = function(param) {
    this.test = param;
  }
});

var newInstance = new App(true);

newInstance.test; // true
```

If you want to use parameters then you need to have an `initialize` method.

### Decorators

Decorator is a cool pattern, and can be easily implemented when you are using Nox! Let's get some code:

``` js
// I'll use a sale example, where taxes can be added to differente sales
Nox('Sale', function(sale) {
  sale.fn.initialize = function(price) {
    this.price = price;
  };

  sale.fn.getPrice = function() {
    return this.price;
  };
});

// Now I'll create some decorators, for different taxes
// Sale stands to the nox constructor
// tax1 is the decorate
Nox.decorator('Sale_tax1', {
  getPrice: function() {
    // uber points to the previous reference of sale
    var price = this.uber.getPrice();
    return price += 50;
  }
});

Nox.decorator('Sale_tax1', {
  getPrice: function() {
    var price = this.uber.getPrice();
    return price += 30;
  }
});

var sale = new Sale(100);
var sale2 = new Sale(100);

sale = sale.decorate('tax1');
sale = sale.decorate('tax2');
sale.getPrice(); // 180
sale2.getPrice(); // 100


```

When creating a decorator, the first parameter is the decorator string...

So for example this string: `Sale_tax1`, `Sale` is my Nox constructor, and `tax1` is the name of the decorator... It **must** be seperated with underline (_). If your nox module is `App.Sale`, then your decorator should be `App.Sale_decorator`

The second parameter is an `object`, which contains all the methods you want to decorate.

`uber` poinst to the previous reference of the instance, so you should use it to get the previous value of a method, otherwise this should not work as expected.

All constructors created with Nox automatically has an `decorate` method attached to its prototype.

### Event Emitter

You can emit events from a constructor to another, using `on`, `emit`.

``` js
Nox('App.EmitSample', 'App.Emitter', function(app, Emitter) {
  app.fn.initialize = function() {
    var emitter = new Emitter();
    emitter.on('custom-emitter', this.customEmitterCallback.bind(this));
  }

  app.fn.customEmitterCallback = function(customParam) {
    console.log('emitting stuff');
    console.log(customParam);
  }
});

Nox('App.Emitter', function(app) {
  app.fn.initialize = function() {
    // little trick, waiting to add the ON on the instance
    setTimeout(function() {
      this.emit('custom-emitter', true)
    }.bind(this), 1000)
  };
});

var instanceOfEmitSample = new App.EmitSample();
```

You can use `once` to emit an event only once (duh!), if you try to emit that event twice, it won't exist.

``` js
// using the previous code...
emitter.once('another-custom-event', function() {});
```

You can also delete an event using `removeListener`:

``` js
emitter.removeListener('custom-emitter');
```

You are able to add as many events you want using `on` or `once`:

``` js
emitter.on('custom-event', callback1);
emitter.on('custom-event', callback2);
emitter.on('custom-event', callback3);
```

All of them will be triggered when you use `emit`, but if you use `removeListener`, all of them will be removed (working on a way to determine which one will be removed).

### Modules

You can use dependency injection for managing your modules.


``` js
Nox('App.Home.view', 'dom', function(view, dom) {
  // awesome stuff
  dom.someAction();
});

Nox('App.Video.view', ['dom', 'ajax'], function(view, dom, ajax) {
  // awesome stuff
  dom.someAction();
  ajax.someAction();
});

```

It accepts an **Array** or **Multiple parameters** as dependencies... And the coolest part is: You don't have to include all modules in your project!

A module is a seperate part of **Nox**, so if your project is small and you want to use only the `ajax` module, you can download the script of this module and include in your page...

You don't even need any module to start with **Nox**

Also your namespaces is automatically turned into a Nox.js module, so you can use dependency injection from a constructor into another constructor.

```js
Nox('App1', function(app1) {
  app1.fn.yeah = true;
});

Nox('App2', 'App1', function(app2, app1) {
  var foo = new app1();

  foo.yeah(); // true
});
```

### Create your own module

You can easily create your own module using `Nox.module`

```js
Nox.module('myCoolModule', function() {
  var myCoolModule = {};

  myCoolModule.myCoolMethod: function() {
    return 'Nox :)';
  };

  return myCoolModule;
});

// usage
Nox('App', 'myCoolModule', function(app, myCoolModule) {
  myCoolModule.myCoolMethod(); // Nox :)
})
```

Don't forget to `return` your module, otherwise it won't work...

If you try to create 2 modules with the same name, it will throw an Error.

If you try to create a module with a name of a namespace already created, it will throw an Error.

Ah, don't forget that you have to include your new module **after** Nox.js was included.

## Modules

- [Events](https://github.com/noxjs/noxjs-events)

## Todos

- Refactor a little bit the core code.

- Improve this README.

## Maintainer

- Mauricio Soares - <http://github.com/msodeveloper>

## Contributing

1. [Fork](http://help.github.com/forking/) Nox.js
2. Create a topic branch - `git checkout -b my_branch`
3. Push to your branch - `git push origin my_branch`
4. Send me a [Pull Request](https://help.github.com/articles/using-pull-requests)
5. That's it!

Please respect the indentation rules and code style.

Use 2 spaces, not tabs.

New features? Would you mind testing it? :)

## Testing

You need [NodeJS](http://nodejs.org/) installed on your machine

1. Run `npm install`
2. Run `npm install -g grunt-cli` to install the grunt command
3. Run `npm test`

## License

(The MIT License)

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.