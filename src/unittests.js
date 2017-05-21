function testUnitTests () {
    
  (function (ut) {
    
    ut.describe("These fail, but tests continue", function () {
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

      ut.it("assertThrowsError", function () {
        ut.assertThrowsError("wrong", function () {
          throw new Error("expected error thrown");
        });
      });
      
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
  })(load())

}