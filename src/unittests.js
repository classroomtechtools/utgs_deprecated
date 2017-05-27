/*
  Runs all the tests for this module
  If you are looking to learn how to utilize it as an assertion library, check out
  the AssertionTests block below.
*/
function testRunner () {

  /* 
    Under the hood, the describe and it functions, as well as the assertThrows* methods,
    are implemented with a context manager, whose functionality is tested here
    (With describe and it methods!)
  */
  (function ContextManagerTests (ut) {

      ut.describe("Context manager", function () {
        ut.it("Returns a function when passed a single param", function () {
          var result = ut.contextManager( {} );
          ut.assertEquals(typeof result, 'function');
        });
        
        ut.it("Has an embedded mode", function () {
          var options = {};
          var result = ut.contextManager( function () {
               return 'blah';
          }, options );
          ut.assertEquals("embedded mode", result, 'blah');
        });
        
        ut.it("Returns argument when provided with two arguments", function () {
          var options = {};
          var factory = ut.contextManager(options);
          var result = factory(function () {
            return 'blah';
          });
          ut.assertEquals(result, 'blah');      
        });
        
        ut.it("Throws error when three arguments passed", function () {
          ut.assertThrowsError(function () {
            ut.contextManager('one', 'two', 'three');
          });
        });
        
        ut.it("Throws error when no params are passed", function () {
          ut.assertThrowsError(function () {
            ut.contextManager(); // no params
          });
        });

        ut.it("Options argument throws TypeError for bad params value (must be a list)", function () {
          var options = {params:'notalist'};
          ut.assertThrowsTypeError(function () {
            ut.contextManager(function () {
              ; // nothing
            }, options);
          });      
        });

        ut.it("Calls enter and exit functions", function () {
          function enter (arr) {
            arr.push('enter');
            return arr;
          }
          function exit (arr) {
            arr.pop(0);
          }
          var factory = ut.contextManager({enter: enter, exit: exit, params:[ [] ]});
      
          factory(function (arg) {
            ut.assertArrayEquals(arg, ['enter']);
          });  
        });
        
        ut.it("Calls exit function on thrown error", function () {
          var testArray = [];
      
          function enter () {
            testArray.push('enter');
            return testArray;
          }  
          function exit (arr) {0
            arr.push('exit');
          }
          var factory = ut.contextManager({enter: enter, exit: exit});
      
          try {
            factory(function (arg) {
              throw new Error("I get swallowed");
            });
          } catch (err) {
            ut.assertArrayEquals(testArray, ['enter', 'exit']);
          }
        });

        ut.it("Passes arguments to enter function", function () {
          var testArray = [];
          var testArg = 'arg';
      
          function enter () {
            ut.assertEquals(testArg, arguments[0]);
            testArray.push(testArg);
            return testArray;
          }  
          function exit (arr) {0
            arr.push('exit');
          }
          var factory = ut.contextManager({enter: enter, exit: exit, params: [testArg]});
      
          factory(function (arg) {
            ; // test occurs on enter
          });
          ut.assertArrayEquals(testArray, [testArg, 'exit']);
        });
      });  // end describe
      
      ut.it("Use object to pass around", function () {
        var returned = ut.contextManager(function (obj) {
          throw new Error("woops");
        }, {
          enter: function (obj) {
            return obj;
          },
          onError: function (err, obj) {
            obj.result = 'modified';
            return null;
          },
          params: [{result:'modifyme'}]
        });
        
        ut.assertEquals('modified', returned.result);
      });
          
  })(load());

  /* 
    Tests for dealing with context managers that returns a context manager
    TODO: Implement
  */
  (function ContextManagerCTX (ut) {
  
    ut.describe("Context Manager contexts", function () {
      ut.it("", function () {
        var result = {
          failed: false
        };
    
        var outerOptions = {
          enter: function () { 
            result.title = 'description'; 
          }, 
          exit: function (obj) { 
            Logger.log("\n%s:\n\t%s %s", result.title, result.failed ? '-' : '+', result.content);
          } 
        };
    
        var innerOptions = {
          enter: function () { 
            return {content: 'hi'};
          }, 
          exit: function (obj) {
            result.content = 'content';
          },
          onError: function (obj) {
            result.failed = true;
            return null;
          }
        };
    
        var returned = ut.contextManager(function () {
          return contextManager(function () {
            throw new Error('hi');
          }, innerOptions);
        }, outerOptions);
      });
        
      ut.describe("This thing", function () {
          ut.assertThrowsError("should do something", function () {
            throw new Error("throws");
          });
      }, {failed: false});

    });
    
  })(load());

  /*
    Tests the assert* range of functions
  */
  (function AssertionTests (ut) {
    
    ut.describe("These all pass", function () {
      ut.it("assertTrue", function () {
        ut.assertTrue(true);
      });

      ut.it("assertFalse", function () {
        ut.assertFalse(false);
      });

      ut.it("assertEquals", function () {
        ut.assertEquals(true, true);
      });

      ut.it("assertNotEquals", function () {
        ut.assertNotEquals(true, false);
      });

      ut.it("assertNull", function () {
        ut.assertNull(null);
      });
      
      ut.it("assertNotNull", function () {
        ut.assertNotNull(undefined);
        ut.assertNotNull(0);
      });
      
      ut.it("assertUndefined", function () {
        ut.assertUndefined(undefined);
      });

      ut.it("assertNotUndefined", function () {
        ut.assertNotUndefined(null);
      });

      ut.it("assertNaN", function () {
        ut.assertNaN(NaN);
      });

      ut.it("assetNotNaN", function () {
        ut.assertNotNaN(0);
      });

      ut.it("assertObjectEquals", function () {
        ut.assertObjectEquals({hi:'hi'}, {hi:'hi'});
      });

      ut.it("assertArrayEquals", function () {
        ut.assertArrayEquals(['hello', 'world'], ['hello', 'world']);
      });

      ut.it("assertEvaluatesToTrue", function () {
        ut.assertEvaluatesToTrue(1);
        ut.assertEvaluatesToTrue(true);
        ut.assertEvaluatesToTrue('hi');
      });

      ut.it("assertEvaluatesToFalse", function () {
        ut.assertEvaluatesToFalse(0);
        ut.assertEvaluatesToFalse(false);
        ut.assertEvaluatesToFalse('');
      });

      ut.it("assertHashEquals", function () {
        ut.assertHashEquals({hi:'hi'}, {hi:'hi'});
      });

      ut.it("assertRoughlyEquals", function () {
        ut.assertRoughlyEquals(1, 1.5, 1);
      });
      
      ut.it("assertContains", function () {
        ut.assertContains(1, [1, 2]);
      });

      ut.it("assertArrayEqualsIgnoringOrder", function () {
        ut.assertArrayEqualsIgnoringOrder([2, 1], [1, 2]);
      });

      ut.it("assertThrowsError", function () {
        ut.assertThrowsError("wrong", function () {
          throw new TypeError("expected error thrown");
        });
      });
      
      ut.it("assertThrowsTypeError", function () {
        ut.assertThrowsTypeError(function () {
          throw new TypeError("error thrown!");
        });
      });

      ut.it("assertThrowsTypeError", function () {
        ut.assertThrowsTypeError(function () {
          throw new TypeError("error thrown!");
        });
      });

      ut.it("assertThrowsRangeError", function () {
        ut.assertThrowsRangeError(function () {
          throw new RangeError("error thrown!");
        });
      });    
      
    });


    ut.describe("These are EXPECTED to FAIL", function () {
      ut.it("assertTrue", function () {
        ut.assertTrue(false);
      });

      ut.it("assertFalse", function () {
        ut.assertFalse(true);
      });

      ut.it("assertEquals", function () {
        ut.assertEquals(true, false);
      });

      ut.it("assertNotEquals", function () {
        ut.assertNotEquals(true, true);
      });

      ut.it("assertNull", function () {
        ut.assertNull('');
      });
      
      ut.it("assertNotNull", function () {
        ut.assertNotNull(null);
      });
      
      ut.it("assertUndefined", function () {
        ut.assertUndefined(null);
      });

      ut.it("assertNotUndefined", function () {
        ut.assertNotUndefined(undefined);
      });

      ut.it("assertNaN", function () {
        ut.assertNaN(0);
      });

      ut.it("assetNotNaN", function () {
        ut.assertNotNaN(NaN);
      });

      ut.it("assertObjectEquals", function () {
        ut.assertObjectEquals({hi:'hi'}, {hi:'hi', something:'hi'});
      });

      ut.it("assertArrayEquals", function () {
        ut.assertArrayEquals(['hello', 'world'], ['hello']);
      });

      ut.it("assertEvaluatesToTrue", function () {
        ut.assertEvaluatesToTrue(false);
      });

      ut.it("assertEvaluatesToFalse", function () {
        ut.assertEvaluatesToFalse(true);
      });

      ut.it("assertHashEquals", function () {
        ut.assertHashEquals({hi:'hi'}, {hi:'hello'});
      });

      ut.it("assertRoughlyEquals", function () {
        ut.assertRoughlyEquals(1, 2, 1);
      });
      
      ut.it("assertContains", function () {
        ut.assertContains(1, [0, 2]);
      });

      ut.it("assertArrayEqualsIgnoringOrder", function () {
        ut.assertArrayEqualsIgnoringOrder([2, 1], [1, 2, 3]);
      });

      // This does not work as expected, because it checks inheritence
      // TODO: Just check name instead?
      //ut.it("assertThrowsError", function () {
      //  ut.assertThrowsError("wrong", function () {
      //    throw new TypeError("expected error thrown");
      //  });
      //});
      
      ut.it("assertThrowsTypeError", function () {
        ut.assertThrowsTypeError(function () {
          throw new Error("error thrown!");
        });
      });

      ut.it("assertThrowsTypeError", function () {
        ut.assertThrowsReferenceError(function () {
          throw new TypeError("error thrown!");
        });
      });

      ut.it("assertThrowsRangeError", function () {
        ut.assertThrowsRangeError(function () {
          throw new Error("error thrown!");
        });
      });    
    });


  })(load());

}