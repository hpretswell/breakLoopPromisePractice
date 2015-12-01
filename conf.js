// conf.js
exports.config = {
    seleniumAddress: 'http://localhost:4444/wd/hub',
    specs: ['promiseSpec.js'],
    
//    capabilities: [{
//        'browserName': 'chrome',
//        "chromeOptions":{
//            binary: 'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe'
//        }
//    }],
    
    onPrepare: function() { 
        browser.driver.manage().window().maximize();
    }
};