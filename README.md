# breakLoopPromisePractice

I promise to pass your test…

Promises and Loops have proven to be a rather challenging concept to someone who has the minimum knowledge of code. However when working with protractor, sometimes they are simply unavoidable. 

In my example, I wanted to create a simple For loop. The For loop would scroll through a list of items in a dropdown, selected each item from the dropdown, so would have to open the dropdown and select a new item each time - this was done by the number of items in the dropdown, and using the For loop to pass the index into the get().click();. When an item was selected there may be a chance that a specific element on the screen was present, and if there was I would execute some code, if it wasn’t I would do nothing and move on to the next iteration of the For loop. However in this case, if the element was present and all the code within the if statement executed correctly, I wanted to stop (or break) the For loop.

My first attempt at this worked in terms of the loop working, but I couldn’t break the loop:

    it("should loop through the dropdown items, select them and 
        end the loop when a grid with rows appears.", function () {
          dropdown.click()
          dropdownItem.count().then(function (dropdownItemsCount) {
            for (var i = 0; i < dropdownItemsCount; i++) {
                var breakLoop = false;
                dropdown.click()
                dropdownItem.get(i).click();
                rows.count().then(function (rowCount) {
                    if (rowCount > 0) {
                        rows.get(0).click();
                        //did some extra stuff here
                        breakLoop = true;
                    }
                });
                if (breakLoop) {
                    break;
                }
            }
        });
    });

The loop in this did work, it went through each item in the dropdown, clicked them, and if there were rows it would click on the first row and perform anything else that was included. However, if breakLoop = true;, it wouldn’t end the loop! 

This is because of the way that promises work, even if you manually stop the test from running, the loop will still run through. The loop will set off all of the promises running before moving on to the code within the For loop. So adding in a break; will not stop the loop from running when promises are involved. To get around this you need to chain the promises. We need to get each promise to return a value to pass into the next promise, and when the promise returns a certain value (e.g. -1), nothing will run. This means the For loop will still run through all the promises, but the code within will not be executed (essentially ‘breaking’ the For loop).

So, you create a for loop which chains the promises, and then you create the function which is the code that’s executed within the loop.

    it("should chain promises", function () {

Here is the function that runs within the loop.

    var createCurrentPromise = function (dropdownItemIndex: number) {
      dropdownItem.click()
      dropdownItem.get(dropdownItemIndex).click();
            
    var currentPromise =rows.count().then(function (count) {
        if (count > 0) {
           rows.get(0).click();
            //do some stuff
            return -1;
        } else {
            return dropdownItemIndex;
        }
        });
      return currentPromise;
    }

As you can see, we create a function which passes in dropdownItemIndex, and returns dropdownItemIndex if the row count is 0, or -1 if the row count is greater than 1 and all that code within the if block is executed.

And here is the For loop which chains the promises:

    dropdown.click();
    dropdownItem.count().then(function (dropdownListCount) {
      var previousPromise = null;
      for (var i = 0; i < dropdownListCount; i++) {
          if (previousPromise !== null) {
              previousPromise = previousPromise.then(function (dropdownItemIndex) {
                  var result;
                  if (dropdownItemIndex >= 0) {
                      result = createCurrentPromise(dropdownItemIndex + 1);
                  } else if (dropdownItemIndex === -1) {
                      result = -1;
                  }
                  return result;
              });
          } else {
              previousPromise = createCurrentPromise(i);
          }
        }
      });
    });
