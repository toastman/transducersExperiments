var msgArr = "Hello Odessa".split('');

var compose = function () {
    var funcs = arguments;
    return function () {
        var args = arguments;
        for (var i = 0 , l = funcs.length; i < l; i++) {
            args = [funcs[i].apply(this, args)];
        }
        return args[0];
    }
}

function mapper (transform) {
  // transducer
  return function (reduce) {
    return function(result, input){
      console.log('mapper: ', input);
      return reduce(result, transform(input))
    }
  }
}

function filterer (predicate) {
  // transducer
  return function (reducer) {
    return function (result, input){
      console.log('filterer: ', input, predicate(input));
      return predicate(input) ? reducer(result, input) : result;
    }
  }
}

function take (number) {
  var count = 0;
  return function (reducer){
    return function (result, input){

      if(count < number){
        ++count;
        console.log('Processed elements: ', count, ' max number ', number);
        return reducer(result, input)
      }

      return result;
    }
  }
}

function toUpperC (letter) {
  return letter.toUpperCase();
}

function isVowel (l) {
  return l.match(/[aeiou]/g) !== null
}

function arrayElCopyer (el, q) {
  return Array.apply(null, Array(5)).map(function () { return el });
}

var transformer = compose(
  mapper(toUpperC),
  filterer(isVowel),
  take(10)
)

var res = msgArr.reduce(transformer(function(result, input) {
  result[input] = arrayElCopyer(input, 5);
  return result;
}), {});

console.log('final result: ', res);
