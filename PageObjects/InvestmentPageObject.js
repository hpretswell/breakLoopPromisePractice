var InvestmentPage = (function() {
    
    function InvestmentPage() {
        this.status = element(by.binding("'Open' : 'Closed'"));
    };
    
    return InvestmentPage;

}) ();

module.exports = InvestmentPage