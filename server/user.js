const AnchorApi = require('./anchor_api')

class User {

    max_ltv = 0.8

    constructor(optimal, min, max, initialCollateral) {
        // user input
        this.optimal
        // user input
        this.min
        // user input
        this.max
        // user input
        this.initialCollateral
        this.collateral = initialCollateral
        // calculated
        this.loan
    }

    calculate_debt_ratio() {
        if(!this.loan) {
            this.loan = this.calculate_current_loan();
        }
        return this.loan / this.calculate_borrow_limit()
    }

    calculate_borrow_limit() {
        // col(t) * max_ltv
        this.update_collateral_value()
        return this.collateral * this.max_ltv
    }

    calculate_current_loan() {
        // borrow_limit * optimal
        return this.calculate_borrow_limit() * this.optimal
    }

    update_collateral_value() {
        // We need to get how much collateral we have right now
        const axios = require('axios').default;
        
        let n_bLuna;
        let price;
      
        axios.get(anchor.get_current_anchor_collateral_url).then(function(response) {
            console.log(response.data.query_result.balance)
            n_bLuna = response.data.query_result.balance;
        }).catch(function(error) {
            console.log(error)
        })
      
        axios.get(anchor.get_current_bluna_price).then(function(response) {
            console.log(response.data.query_result.rate)
            price = response.data.query_result.rate
        }).catch(function(error) {
            console.log(error)
        })
        
        // What is the current price of bLuna
        return n_bLuna/1000000 * price;
      }
}

module.exports = User;