var HomePage = require("./PageObjects/HomePageObject");
var InvestmentPage = require("./PageObjects/InvestmentPageObject");

var Helper = function() {
    this.testUrlEnd = function(urlend) {
        browser.getLocationAbsUrl().then(function(url) {
            expect(url.split('#')[1]).toBe(urlend);
        });
    }
};

describe("Using break to break a loop that uses promises", function() {
    var homePage = new HomePage();
    var investmentPage = new InvestmentPage();
    var helper = new Helper();
    
    beforeEach(function() {
        browser.get("http://blog.scottlogic.com/alee/assets/spa-an-ko/Angular/index.html#/home");
    });
    
    xit("should test elements can be selected", function () {
        homePage.investments.get(0).click();
        expect(investmentPage.status.getText()).toEqual("Open");
        homePage.navButtons.get(0).click();
        helper.testUrlEnd("/home");
    });
    
    //this will give the error "illegal break loop" 
    
//    it("should not work when inside for loop", function () {
//        homePage.investments.count().then(function(investmentCount) {
//            for(var i = 0; i < investmentCount; i ++) {
//                homePage.investments.get(i).click();
//                investmentPage.status.getText().then(function(statusText) {
//                    if (statusText = Closed) {
//                        homePage.homeButton.click();
//                    } else {
//                        break;
//                    }
//                });
//            };
//        });   
//    });
    
    //this one doesn't work because of how promises work
    //will loop through and never end
    
    xit("should not work even if outside of the for loop", function() {
        homePage.investments.count().then(function(investmentCount) {
            for(var i = 0; i < investmentCount; i ++) {
                var breakLoop = false;
                homePage.investments.get(i).click();
                investmentPage.status.getText().then(function(statusText) {
                    if (statusText = "Open") {
                        homePage.navButtons.get(0).click();
                        breakLoop = true;
                    }
                });
                if (breakLoop) {
                    break;
                }
            };
        }); 
    });
    
    //this technically should work...
    
    it("should work if promises are chained", function () {
        
        homePage.navButtons.get(0).click();
        homePage.investments.count().then(function(investmentCount) {
            var previousPromise = null;
            for (var i = 0; i < investmentCount; i++) {
                if (previousPromise !== null) {
                    previousPromise = previousPromise.then(function(rowCountIndex) {
                        var result;
                        if (rowCountIndex >= 0) {
                            result = createCurrentPromise(rowCountIndex + 1);
                        } else if (rowCountIndex === -1) {
                            result = -1;
                        }
                        return result;
                    });
                } else {
                    previousPromise = createCurrentPromise(i);
                }
            }
        });
        
        var createCurrentPromise = function(rowCountIndex) {
            
            
            homePage.investments.get(rowCountIndex).click();
            
            var currentPromise = investmentPage.status.getText().then(function(text) {
                var result;
                if (text === "Open") {
                    console.log(text)
                    expect(investmentPage.status.getText()).toEqual("Open");
                    
                    result =  -1;
                } 
                
                else {
                    console.log(text)
                    expect(investmentPage.status.getText()).toEqual("Closed");
                    result = rowCountIndex;
                }
                
                homePage.navButtons.get(0).click();
                return result;
            });
            //browser.sleep(5000);
            
            return currentPromise;
        }
    });   
});
    