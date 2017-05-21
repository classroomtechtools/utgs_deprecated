/**
 * --- GsUnit ---
 *
 *  Copyright (c) 2012 James Ferreira
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 *
 *  Thank you Edward Hieatt, http://www.JsUnit.net
 * 
 *
 * 
 */
 
/*

   Modifications by Adam Morris (http://classroomtechtools.com):

   Copyright (c) 2017 Adam Morris

    - Refactored with module pattern, with load() as entry point
    - assertThrows* methods
    - describe and it pattern of use (c.f. unittests)
    - withContext

*/

load = function () {

  var GsUnit = {};

  /**
  * For convenience, a variable that equals "undefined"
  */
  var GsUnit_UNDEFINED_VALUE;
  
  /**
  * Whether or not the current test page has been (completely) loaded yet
  */
  var isTestPageLoaded = false;
  
  /**
  * Predicate used for testing JavaScript == (i.e. equality excluding type)
  */
  GsUnit.DOUBLE_EQUALITY_PREDICATE = function(var1, var2) {return var1 == var2;};
  
  /**
  * Predicate used for testing JavaScript === (i.e. equality including type)
  */
  GsUnit.TRIPLE_EQUALITY_PREDICATE = function(var1, var2) {return var1 === var2;};
  
  /**
  * Predicate used for testing whether two obects' toStrings are equal
  */
  GsUnit.TO_STRING_EQUALITY_PREDICATE = function(var1, var2) {return var1.toString() === var2.toString();};
  
  /**
  * Hash of predicates for testing equality by primitive type
  */
  GsUnit.PRIMITIVE_EQUALITY_PREDICATES = {
      'String':   GsUnit.DOUBLE_EQUALITY_PREDICATE,
      'Number':   GsUnit.DOUBLE_EQUALITY_PREDICATE,
      'Boolean':  GsUnit.DOUBLE_EQUALITY_PREDICATE,
      'Date':     GsUnit.TRIPLE_EQUALITY_PREDICATE,
      'RegExp':   GsUnit.TO_STRING_EQUALITY_PREDICATE,
      'Function': GsUnit.TO_STRING_EQUALITY_PREDICATE
  }
  
  /**
  * @param Any object
  * @return String - the type of the given object
  * @private
  */
  GsUnit.trueTypeOf = function(something) {
      var result = typeof something;
      try {
          switch (result) {
              case 'string':
                  break;
              case 'boolean':
                  break;
              case 'number':
                  break;
              case 'object':
              case 'function':
                  switch (something.constructor) {
                      case new String().constructor:
                          result = 'String';
                          break;
                      case new Boolean().constructor:
                          result = 'Boolean';
                          break;
                      case new Number().constructor:
                          result = 'Number';
                          break;
                      case new Array().constructor:
                          result = 'Array';
                          break;
                      case new RegExp().constructor:
                          result = 'RegExp';
                          break;
                      case new Date().constructor:
                          result = 'Date';
                          break;
                      case Function:
                          result = 'Function';
                          break;
                      default:
                          var m = something.constructor.toString().match(/function\s*([^( ]+)\(/);
                          if (m)
                              result = m[1];
                          else
                              break;
                  }
                  break;
          }
      }
      finally {
          result = result.substr(0, 1).toUpperCase() + result.substr(1);
          return result;
      }
  }
  
  /**
  * @private
  */
  GsUnit.displayStringForValue = function(aVar) {
      var result = '<' + aVar + '>';
      if (!(aVar === null || aVar === GsUnit_UNDEFINED_VALUE)) {
          result += ' (' + GsUnit.trueTypeOf(aVar) + ')';
      }
      return result;
  }  
  
  /**
  * @private
  */
  GsUnit.validateArguments = function(expectedNumberOfNonCommentArgs, args) {
      if (!( args.length == expectedNumberOfNonCommentArgs ||
             (args.length == expectedNumberOfNonCommentArgs + 1 && (typeof(args[0]) == 'string') || args[0] == null)))
          throw 'Incorrect arguments passed to assert function';
  }
  
  /**
  * @private
  */
  GsUnit.nonCommentArg = function(desiredNonCommentArgIndex, expectedNumberOfNonCommentArgs, args) {
      return GsUnit.argumentsIncludeComments(expectedNumberOfNonCommentArgs, args) ?
             args[desiredNonCommentArgIndex] :
             args[desiredNonCommentArgIndex - 1];
  }  
    
  /**
  * @private
  */
  GsUnit.argumentsIncludeComments = function(expectedNumberOfNonCommentArgs, args) {
      return args.length == expectedNumberOfNonCommentArgs + 1;
  }
  /**
  * @private
  */
  GsUnit.commentArg = function(expectedNumberOfNonCommentArgs, args) {
      if (GsUnit.argumentsIncludeComments(expectedNumberOfNonCommentArgs, args))
          return args[0];
  
      return null;
  }
  
  /**
  * @private
  */
  GsUnit.checkEquals = function(var1, var2) {
      return var1 === var2;
  }
  
  /**
  * @private
  */
  GsUnit.checkNotUndefined = function(aVar) {
      return aVar !== GsUnit_UNDEFINED_VALUE;
  }
  
  /**
  * @private
  */
  GsUnit.checkNotNull = function(aVar) {
      return aVar !== null;
  }  
  
  /**
  * All assertions ultimately go through this method.
  * @private
  */
  GsUnit.assert = function(comment, booleanValue, failureMessage) {
      if (!booleanValue)
        throw new GsUnit.Failure(comment, failureMessage);
  }  

  
  /**
  * @class
  * A GsUnit.Failure represents an assertion failure (or a call to fail()) during the execution of a Test Function
  * @param comment an optional comment about the failure
  * @param message the reason for the failure
  */
  GsUnit.Failure = function(comment, message) {
      /**
       * Declaration that this is a GsUnit.Failure
       * @ignore
       */
      this.isGsUnitFailure = true;
      /**
       * An optional comment about the failure
       */
      this.comment = comment;
      /**
       * The reason for the failure
       */
      this.GsUnitMessage = message;
      /**
       * The stack trace at the point at which the failure was encountered
       */
     // this.stackTrace = GsUnit.Util.getStackTrace();
    
    var failComment = '';
    if (comment != null) failComment = 'Comment: '+comment; 
    
    throw failComment +'  -- Failure: '+ message;
  }

    
  /**
  * @class
  * A GsUnitAssertionArgumentError represents an invalid call to an assertion function - either an invalid argument type
  * or an incorrect number of arguments
  * @param description a description of the argument error
  */
  GsUnit.AssertionArgumentError = function(description) {
      /**
       * A description of the argument error
       */
      this.description = description;
    throw 'Argument error: '+ description;
  }  
    
    
  /**
  * @class
  * @constructor
  * Contains utility functions for the GsUnit framework
  */
  GsUnit.Util = {};
  
  
  /*
    @param {Function} body: optional
    @param {Object} options: @prop {Function} enter: The function called on entry
                             @prop {Function} exit: The function called on exit
                             @prop {Function} onError: The function called on error, not re-raised if returns null
                             @prop {Array} params: (optional) arguments sent to the entry function
    @throws re-raises error that was raised in execution of body function (unless onError is defined and returns null)
    @throws Error if sent no parameters or more than two
    @returns returned object from @param body if in embedded mode (two-parameters passed)
    @returns function if in fastory mode (one-parameter passed):
      @param {Function} body (same as above)
  */
  GsUnit.Util.contextManager = function () {
  
    function _parseOptions(opt) {
      var ret = {};
      ret.enter = opt.enter || function () { return null; };
      ret.exit = opt.exit || function (arg) {};
      ret.params = opt.params || [];
      if (!Array.isArray(ret.params)) throw new TypeError("options.params must be an array");
      ret.onError = opt.onError || function () {};
      return ret;
    }
  
    if (arguments.length == 1) {
  
      var options = _parseOptions(arguments[0]);
    
      return function (body) {
        var ret = options.enter.apply(null, options.params);
        
        try {
          ret = body(result) || ret;
        } catch (err) {
          if (options.onError(err, ret) !== null)
            throw new err.constructor(err.message + ' --> ' + err.stack.toString());
        } finally {
          options.exit(ret);
        }
  
        return ret;
      };
  
   } else if (arguments.length == 2) {
  
     var body = arguments[0],
         options = _parseOptions(arguments[1]);
     options = _parseOptions(options);
     
     var ret = options.enter.apply(null, options.params);
     try {
       ret = body(ret) || ret;
     } catch (err) {
       if (options.onError(err, ret) !== null)
         throw new err.constructor(err.message + ' --> ' + err.stack.toString());
     } finally {
       options.exit(ret);
     }

   } else {
     throw new Error("Pass either one or two arguments");
   }
  
   return ret;
  };

  /**
  * Standardizes an HTML string by temporarily creating a DIV, setting its innerHTML to the string, and the asking for
  * the innerHTML back
  * @param html
  */
  GsUnit.Util.standardizeHTML = function(html) {
      var translator = document.createElement("DIV");
      translator.innerHTML = html;
      return GsUnit.Util.trim(translator.innerHTML);
  }
  
  /**
  * Returns whether the given string is blank after being trimmed of whitespace
  * @param string
  */
  GsUnit.Util.isBlank = function(string) {
      return GsUnit.Util.trim(string) == '';
  }
  
  /**
  * Implemented here because the JavaScript Array.push(anObject) and Array.pop() functions are not available in IE 5.0
  * @param anArray the array onto which to push
  * @param anObject the object to push onto the array
  */
  GsUnit.Util.push = function(anArray, anObject) {
      anArray[anArray.length] = anObject;
  }
  
  /**
  * Implemented here because the JavaScript Array.push(anObject) and Array.pop() functions are not available in IE 5.0
  * @param anArray the array from which to pop
  */
  GsUnit.Util.pop = function pop(anArray) {
      if (anArray.length >= 1) {
          delete anArray[anArray.length - 1];
          anArray.length--;
      }
  }
  
  /**
  * Returns the name of the given function, or 'anonymous' if it has no name
  * @param aFunction
  */
  GsUnit.Util.getFunctionName = function(aFunction) {
      var regexpResult = aFunction.toString().match(/function(\s*)(\w*)/);
      if (regexpResult && regexpResult.length >= 2 && regexpResult[2]) {
              return regexpResult[2];
      }
      return 'anonymous';
  }
  
  /**
  * Returns the current stack trace
  */
  GsUnit.Util.getStackTrace = function() {
      var result = '';
  
      if (typeof(arguments.caller) != 'undefined') { // IE, not ECMA
          for (var a = arguments.caller; a != null; a = a.caller) {
              result += '> ' + GsUnit.Util.getFunctionName(a.callee) + '\n';
              if (a.caller == a) {
                  result += '*';
                  break;
              }
          }
      }
      else { // Mozilla, not ECMA
          // fake an exception so we can get Mozilla's error stack
          try
          {
              foo.bar;
          }
          catch(exception)
          {
              var stack = GsUnit.Util.parseErrorStack(exception);
              for (var i = 1; i < stack.length; i++)
              {
                  result += '> ' + stack[i] + '\n';
              }
          }
      }
  
      return result;
  }
  
  /**
  * Returns an array of stack trace elements from the given exception
  * @param exception
  */
  GsUnit.Util.parseErrorStack = function(exception) {
      var stack = [];
      var name;
  
      if (!exception || !exception.stack) {
          return stack;
      }
  
      var stacklist = exception.stack.split('\n');
  
      for (var i = 0; i < stacklist.length - 1; i++) {
          var framedata = stacklist[i];
  
          name = framedata.match(/^(\w*)/)[1];
          if (!name) {
              name = 'anonymous';
          }
  
          stack[stack.length] = name;
      }
      // remove top level anonymous functions to match IE
  
      while (stack.length && stack[stack.length - 1] == 'anonymous') {
          stack.length = stack.length - 1;
      }
      return stack;
  }
  
  /**
  * Strips whitespace from either end of the given string
  * @param string
  */
  GsUnit.Util.trim = function(string) {
      if (string == null)
          return null;
  
      var startingIndex = 0;
      var endingIndex = string.length - 1;
  
      var singleWhitespaceRegex = /\s/;
      while (string.substring(startingIndex, startingIndex + 1).match(singleWhitespaceRegex))
          startingIndex++;
  
      while (string.substring(endingIndex, endingIndex + 1).match(singleWhitespaceRegex))
          endingIndex--;
  
      if (endingIndex < startingIndex)
          return '';
  
      return string.substring(startingIndex, endingIndex + 1);
  }
  
  GsUnit.Util.getKeys = function(obj) {
      var keys = [];
      for (var key in obj) {
          GsUnit.Util.push(keys, key);
      }
      return keys;
  }
  
  GsUnit.Util.inherit = function(superclass, subclass) {
      var x = function() {};
      x.prototype = superclass.prototype;
      subclass.prototype = new x();
  }

  return {
      
    /**
    * Checks that two values are equal (using ===)
    * @param {String} comment optional, displayed in the case of failure
    * @param {Value} expected the expected value
    * @param {Value} actual the actual value
    * @throws GsUnit.Failure if the values are not equal
    * @throws GsUnitInvalidAssertionArgument if an incorrect number of arguments is passed
    */
    assertEquals: function () {
        GsUnit.validateArguments(2, arguments);
        var var1 = GsUnit.nonCommentArg(1, 2, arguments);
        var var2 = GsUnit.nonCommentArg(2, 2, arguments);
      GsUnit.assert(GsUnit.commentArg(2, arguments), GsUnit.checkEquals(var1, var2), 'Expected ' + GsUnit.displayStringForValue(var1) + ' but was ' + GsUnit.displayStringForValue(var2));
    },
    
    
    /**
    * Checks that the given boolean value is true.
    * @param {String} comment optional, displayed in the case of failure
    * @param {Boolean} value that is expected to be true
    * @throws GsUnit.Failure if the given value is not true
    * @throws GsUnitInvalidAssertionArgument if the given value is not a boolean or if an incorrect number of arguments is passed
    */
    assert: function () {
        GsUnit.validateArguments(1, arguments);
        var booleanValue = GsUnit.nonCommentArg(1, 1, arguments);
    
        if (typeof(booleanValue) != 'boolean')
            throw new GsUnit.AssertionArgumentError('Bad argument to assert(boolean)');
    
        GsUnit.assert(GsUnit.commentArg(1, arguments), booleanValue === true, 'Call to assert(boolean) with false');
    },
    
    
    /**
    * Synonym for assertTrue
    * @see #assert
    */
    assertTrue: function () {
        GsUnit.validateArguments(1, arguments);
        this.assert(GsUnit.commentArg(1, arguments), GsUnit.nonCommentArg(1, 1, arguments));
    },
    
    /**
    * Checks that a boolean value is false.
    * @param {String} comment optional, displayed in the case of failure
    * @param {Boolean} value that is expected to be false
    * @throws GsUnit.Failure if value is not false
    * @throws GsUnitInvalidAssertionArgument if the given value is not a boolean or if an incorrect number of arguments is passed
    */
    assertFalse: function () {
        GsUnit.validateArguments(1, arguments);
        var booleanValue = GsUnit.nonCommentArg(1, 1, arguments);
    
        if (typeof(booleanValue) != 'boolean')
            throw new GsUnit.AssertionArgumentError('Bad argument to assertFalse(boolean)');
    
        GsUnit.assert(GsUnit.commentArg(1, arguments), booleanValue === false, 'Call to assertFalse(boolean) with true');
    },
    
    /**
    * Checks that two values are not equal (using !==)
    * @param {String} comment optional, displayed in the case of failure
    * @param {Value} value1 a value
    * @param {Value} value2 another value
    * @throws GsUnit.Failure if the values are equal
    * @throws GsUnitInvalidAssertionArgument if an incorrect number of arguments is passed
    */
    assertNotEquals: function () {
        GsUnit.validateArguments(2, arguments);
        var var1 = GsUnit.nonCommentArg(1, 2, arguments);
        var var2 = GsUnit.nonCommentArg(2, 2, arguments);
        GsUnit.assert(GsUnit.commentArg(2, arguments), var1 !== var2, 'Expected not to be ' + GsUnit.displayStringForValue(var2));
    },
    
    /**
    * Checks that a value is null
    * @param {String} comment optional, displayed in the case of failure
    * @param {Null} value the value
    * @throws GsUnit.Failure if the value is not null
    * @throws GsUnitInvalidAssertionArgument if an incorrect number of arguments is passed
    */
    assertNull: function () {
        GsUnit.validateArguments(1, arguments);
        var aVar = GsUnit.nonCommentArg(1, 1, arguments);
        GsUnit.assert(GsUnit.commentArg(1, arguments), aVar === null, 'Expected ' + GsUnit.displayStringForValue(null) + ' but was ' + GsUnit.displayStringForValue(aVar));
    },
    
    /**
    * Checks that a value is not null
    * @param {String} comment optional, displayed in the case of failure
    * @param {Value} value the value
    * @throws GsUnit.Failure if the value is null
    * @throws GsUnitInvalidAssertionArgument if an incorrect number of arguments is passed
    */
    assertNotNull: function() {
        GsUnit.validateArguments(1, arguments);
        var aVar = GsUnit.nonCommentArg(1, 1, arguments);
        GsUnit.assert(GsUnit.commentArg(1, arguments), GsUnit.checkNotNull(aVar), 'Expected not to be ' + GsUnit.displayStringForValue(null));
    },
    
    /**
    * Checks that a value is undefined
    * @param {String} comment optional, displayed in the case of failure
    * @param {Value} value the value
    * @throws GsUnit.Failure if the value is not undefined
    * @throws GsUnitInvalidAssertionArgument if an incorrect number of arguments is passed
    */
    assertUndefined: function () {
        GsUnit.validateArguments(1, arguments);
        var aVar = GsUnit.nonCommentArg(1, 1, arguments);
        GsUnit.assert(GsUnit.commentArg(1, arguments), aVar === GsUnit_UNDEFINED_VALUE, 'Expected ' + GsUnit.displayStringForValue(GsUnit_UNDEFINED_VALUE) + ' but was ' + GsUnit.displayStringForValue(aVar));
    },
    
    /**
    * Checks that a value is not undefined
    * @param {String} comment optional, displayed in the case of failure
    * @param {Value} value the value
    * @throws GsUnit.Failure if the value is undefined
    * @throws GsUnitInvalidAssertionArgument if an incorrect number of arguments is passed
    */
    assertNotUndefined: function () {
        GsUnit.validateArguments(1, arguments);
        var aVar = GsUnit.nonCommentArg(1, 1, arguments);
        GsUnit.assert(GsUnit.commentArg(1, arguments), GsUnit.checkNotUndefined(aVar), 'Expected not to be ' + GsUnit.displayStringForValue(GsUnit_UNDEFINED_VALUE));
    },
    
    /**
    * Checks that a value is NaN (Not a Number)
    * @param {String} comment optional, displayed in the case of failure
    * @param {Value} value the value
    * @throws GsUnit.Failure if the value is a number
    * @throws GsUnitInvalidAssertionArgument if an incorrect number of arguments is passed
    */
    assertNaN: function () {
        GsUnit.validateArguments(1, arguments);
        var aVar = GsUnit.nonCommentArg(1, 1, arguments);
        GsUnit.assert(GsUnit.commentArg(1, arguments), isNaN(aVar), 'Expected NaN');
    },
    
    /**
    * Checks that a value is not NaN (i.e. is a number)
    * @param {String} comment optional, displayed in the case of failure
    * @param {Number} value the value
    * @throws GsUnit.Failure if the value is not a number
    * @throws GsUnitInvalidAssertionArgument if an incorrect number of arguments is passed
    */
    assertNotNaN: function () {
        GsUnit.validateArguments(1, arguments);
        var aVar = GsUnit.nonCommentArg(1, 1, arguments);
        GsUnit.assert(GsUnit.commentArg(1, arguments), !isNaN(aVar), 'Expected not NaN');
    },
    
    /**
    * Checks that an object is equal to another using === for primitives and their object counterparts but also desceding
    * into collections and calling assertObjectEquals for each element
    * @param {String} comment optional, displayed in the case of failure
    * @param {Object} value the expected value
    * @param {Object} value the actual value
    * @throws GsUnit.Failure if the actual value does not equal the expected value
    * @throws GsUnitInvalidAssertionArgument if an incorrect number of arguments is passed
    */
    assertObjectEquals: function () {
        GsUnit.validateArguments(2, arguments);
        var var1 = GsUnit.nonCommentArg(1, 2, arguments);
        var var2 = GsUnit.nonCommentArg(2, 2, arguments);
        var failureMessage = GsUnit.commentArg(2, arguments) ? GsUnit.commentArg(2, arguments) : '';
        if (var1 === var2)
            return;
    
        var isEqual = false;
    
        var typeOfVar1 = GsUnit.trueTypeOf(var1);
        var typeOfVar2 = GsUnit.trueTypeOf(var2);
    
        if (typeOfVar1 == typeOfVar2) {
            var primitiveEqualityPredicate = GsUnit.PRIMITIVE_EQUALITY_PREDICATES[typeOfVar1];
            if (primitiveEqualityPredicate) {
                isEqual = primitiveEqualityPredicate(var1, var2);
            } else {
                var expectedKeys = GsUnit.Util.getKeys(var1).sort().join(", ");
                var actualKeys = GsUnit.Util.getKeys(var2).sort().join(", ");
                if (expectedKeys != actualKeys) {
                    GsUnit.assert(failureMessage, false, 'Expected keys "' + expectedKeys + '" but found "' + actualKeys + '"');
                }
                for (var i in var1) {
                    this.assertObjectEquals(failureMessage + ' found nested ' + typeOfVar1 + '@' + i + '\n', var1[i], var2[i]);
                }
                isEqual = true;
            }
        }
        GsUnit.assert(failureMessage, isEqual, 'Expected ' + GsUnit.displayStringForValue(var1) + ' but was ' + GsUnit.displayStringForValue(var2));
    },
    
    /**
    * Checks that an array is equal to another by checking that both are arrays and then comparing their elements using assertObjectEquals
    * @param {String} comment optional, displayed in the case of failure
    * @param {Array} value the expected array
    * @param {Array} value the actual array
    * @throws GsUnit.Failure if the actual value does not equal the expected value
    * @throws GsUnitInvalidAssertionArgument if an incorrect number of arguments is passed
    */
    assertArrayEquals: function () {
        GsUnit.validateArguments(2, arguments);
        var array1 = GsUnit.nonCommentArg(1, 2, arguments);
        var array2 = GsUnit.nonCommentArg(2, 2, arguments);
        if (GsUnit.trueTypeOf(array1) != 'Array' || GsUnit.trueTypeOf(array2) != 'Array') {
            throw new GsUnit.AssertionArgumentError('Non-array passed to assertArrayEquals');
        }
        this.assertObjectEquals(GsUnit.commentArg(2, arguments), GsUnit.nonCommentArg(1, 2, arguments), GsUnit.nonCommentArg(2, 2, arguments));
    },
    
    /**
    * Checks that a value evaluates to true in the sense that value == true
    * @param {String} comment optional, displayed in the case of failure
    * @param {Value} value the value
    * @throws GsUnit.Failure if the actual value does not evaluate to true
    * @throws GsUnitInvalidAssertionArgument if an incorrect number of arguments is passed
    */
    assertEvaluatesToTrue: function () {
        GsUnit.validateArguments(1, arguments);
        var value = GsUnit.nonCommentArg(1, 1, arguments);
        if (!value)
            this.fail(GsUnit.commentArg(1, arguments));
    },
    
    /**
    * Checks that a value evaluates to false in the sense that value == false
    * @param {String} comment optional, displayed in the case of failure
    * @param {Value} value the value
    * @throws GsUnit.Failure if the actual value does not evaluate to true
    * @throws GsUnitInvalidAssertionArgument if an incorrect number of arguments is passed
    */
    assertEvaluatesToFalse: function () {
        GsUnit.validateArguments(1, arguments);
        var value = GsUnit.nonCommentArg(1, 1, arguments);
        if (value)
            this.fail(GsUnit.commentArg(1, arguments));
    },
    
    /**
    * Checks that a hash is has the same contents as another by iterating over the expected hash and checking that each
    * key's value is present in the actual hash and calling assertEquals on the two values, and then checking that there is
    * no key in the actual hash that isn't present in the expected hash.
    * @param {String} comment optional, displayed in the case of failure
    * @param {Object} value the expected hash
    * @param {Object} value the actual hash
    * @throws GsUnit.Failure if the actual hash does not evaluate to true
    * @throws GsUnitInvalidAssertionArgument if an incorrect number of arguments is passed
    */
    assertHashEquals: function () {
        GsUnit.validateArguments(2, arguments);
        var var1 = GsUnit.nonCommentArg(1, 2, arguments);
        var var2 = GsUnit.nonCommentArg(2, 2, arguments);
        for (var key in var1) {
            this.assertNotUndefined("Expected hash had key " + key + " that was not found", var2[key]);
            this.assertEquals(
                "Value for key " + key + " mismatch - expected = " + var1[key] + ", actual = " + var2[key],
                var1[key], var2[key]
            );
        }
        for (var key in var2) {
            this.assertNotUndefined("Actual hash had key " + key + " that was not expected", var1[key]);
        }
    },
    
    /**
    * Checks that two value are within a tolerance of one another
    * @param {String} comment optional, displayed in the case of failure
    * @param {Number} value1 a value
    * @param {Number} value1 another value
    * @param {Number} tolerance the tolerance
    * @throws GsUnit.Failure if the two values are not within tolerance of each other
    * @throws GsUnitInvalidAssertionArgument if an incorrect number of arguments is passed
    */
    assertRoughlyEquals: function () {
        GsUnit.validateArguments(3, arguments);
        var expected = GsUnit.nonCommentArg(1, 3, arguments);
        var actual = GsUnit.nonCommentArg(2, 3, arguments);
        var tolerance = GsUnit.nonCommentArg(3, 3, arguments);
        this.assertTrue(
            "Expected " + expected + ", but got " + actual + " which was more than " + tolerance + " away",
            Math.abs(expected - actual) < tolerance
        );
    },
    
    /**
    * Checks that a collection contains a value by checking that collection.indexOf(value) is not -1
    * @param {String} comment optional, displayed in the case of failure
    * @param {Value} collection the collection
    * @param {Value} value the value
    * @throws GsUnit.Failure if the collection does not contain the value
    * @throws GsUnitInvalidAssertionArgument if an incorrect number of arguments are passed
    */
    assertContains: function () {
        GsUnit.validateArguments(2, arguments);
        var value = GsUnit.nonCommentArg(1, 2, arguments);
        var collection = GsUnit.nonCommentArg(2, 2, arguments);
        this.assertTrue(
            "Expected '" + collection + "' to contain '" + value + "'",
            collection.indexOf(value) != -1
        );
    },
    
    /**
    * Checks that two arrays have the same contents, ignoring the order of the contents
    * @param {String} comment optional, displayed in the case of failure
    * @param {Array} array1 first array
    * @param {Array} array2 second array
    * @throws GsUnit.Failure if the two arrays contain different contents
    * @throws GsUnitInvalidAssertionArgument if an incorrect number of arguments are passed
    */
    assertArrayEqualsIgnoringOrder: function() {
        GsUnit.validateArguments(2, arguments);
        var var1 = GsUnit.nonCommentArg(1, 2, arguments);
        var var2 = GsUnit.nonCommentArg(2, 2, arguments);
    
        var notEqualsMessage = "Expected arrays " + GsUnit.displayStringForValue(var1) + " and " + GsUnit.displayStringForValue(var2) + " to be equal (ignoring order)";
        var notArraysMessage = "Expected arguments " + GsUnit.displayStringForValue(var1) + " and " + GsUnit.displayStringForValue(var2) + " to be arrays";
    
        GsUnit.assert(GsUnit.commentArg(2, arguments), GsUnit.checkNotNull(var1), notEqualsMessage);
        GsUnit.assert(GsUnit.commentArg(2, arguments), GsUnit.checkNotNull(var2), notEqualsMessage);
    
        GsUnit.assert(GsUnit.commentArg(2, arguments), GsUnit.checkNotUndefined(var1.length), notArraysMessage);
        GsUnit.assert(GsUnit.commentArg(2, arguments), GsUnit.checkNotUndefined(var1.join), notArraysMessage);
        GsUnit.assert(GsUnit.commentArg(2, arguments), GsUnit.checkNotUndefined(var2.length), notArraysMessage);
        GsUnit.assert(GsUnit.commentArg(2, arguments), GsUnit.checkNotUndefined(var2.join), notArraysMessage);
    
        GsUnit.assert(GsUnit.commentArg(1, arguments), GsUnit.checkEquals(var1.length, var2.length), notEqualsMessage);
    
        for (var i = 0; i < var1.length; i++) {
            var found = false;
            for (var j = 0; j < var2.length; j++) {
                try {
                    this.assertObjectEquals(notEqualsMessage, var1[i], var2[j]);
                    found = true;
                } catch (ignored) {
                }
            }
            GsUnit.assert(GsUnit.commentArg(2, arguments), found, notEqualsMessage);
        }
    },
    
    assertThrows: function () {
      GsUnit.validateArguments(2, arguments);
      var func = GsUnit.nonCommentArg(1, 2, arguments);
      var expectedError = GsUnit.nonCommentArg(2, 2, arguments);
      var wrongError = "Expected thrown error to be of type " + expectedError.name;
      var err = null;
      
      try {
        func.call();
      } catch (err) {
        GsUnit.assert(GsUnit.commentArg(2, arguments), err instanceof expectedError, "Expected thrown error of type " + err.name + " to be of type " + expectedError.name);
      }
    
      if (err)
        throw GsUnit.Failure("No error was thrown, expecting error of type '" + expectedError.name);
    },

    assertThrowsError: function (func) {
      return this.assertThrows(func, Error);
    },

    assertThrowsTypeError: function (func) {
      return this.assertThrows(func, TypeError);
    },
        
    assertThrowsRangeError: function (func) {
      return this.assertThrows(func, RangeError);
    },
    
    assertThrowsReferenceError: function (func) {
      return this.assertThrows(func, ReferenceError);
    },
    
    describe: function (description, body) {
      Logger.log(description);
      body.call();
    },
    
    it: function (shouldMessage, body) {
      Logger.log('\t' + shouldMessage);
      GsUnit.Util.contextManager(body, {
        enter: function (obj) { 
          obj.result = '\t\t👍 PASSED'; 
          return obj;
        },
        onError: function (err, obj) { 
          obj.result = '\t\t👎' + err.toString();
          return null; 
        },
        exit: function (obj) {
          Logger.log(obj.result);
        },
        params: [ {} ]
      });
    },

    withContext: function (body, options) {
      GsUnit.Util.contextManager(body, options);
    },
       
    /**
    * Causes a failure
    * @param failureMessage the message for the failure
    */
    fail: function (failureMessage) {
        throw new GsUnit.Failure("Call to fail()", failureMessage);
    },
  };
}
