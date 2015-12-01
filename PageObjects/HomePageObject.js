var HomePage = (function () {
    function HomePage() {
        this.navButtons = element.all(by.css(".nav.navbar-nav"));
        this.investments = element.all(by.repeater("investment in investments"));
    };
    
    return HomePage;

}) ();

module.exports = HomePage;