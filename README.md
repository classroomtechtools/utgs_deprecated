# utgs
A unit testing framework for GSuite Scripting.

### To install
- Project ID: *MY7ZIdrV4nCD09s1L_4aSp3nHlT3Tf0e1*
- Check out unittests.js for example usage

### Example usage
Use it to test code that writes to a spreadsheet

```js
function TestRunner () {

  (function UnitTests (ut) {

    // utility function:
    withTempSpreadsheet = function (func) {
      ut.withContext(func, { 
        enter: function () {
          return SpreadsheetApp.create('Temporary');
        },
        exit: function (ss) {
          Drive.Files.remove(ss.getId()); // deletes the ss returned from enter 
        }
      });
    };

    ut.describe('Spreadsheets', function () {

      ut.it("should append a row with appendRow", function () { 
        withTempSpreadsheet(function (ss) { // ss is the temporary spreadsheet created above
          ss.appendRow(['one', 'two']);
          var data = ss.getActiveSheet().getDataRange().getValues();
          ut.assertArrayEquals([['one', 'two']], data);
      });

      ut.it("should set headers with setFrozenRows", function () { 
        withTempSpreadsheet(function (ss) { // ss is the temporary spreadsheet created above
          ss.setFrozenRows(2);
          var data = ss.getFrozenRows();
          ut.assertEquals(2, data);
      });

    });

    })

  })(utgs.load());

}
```

A new spreadsheet is created and destroyed on every iteration, and even if an error occurs during the execution. It writes the output via Logger.log.
