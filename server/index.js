const express = require('express')
const AnchorApi = require('./anchor_api')
const User = require('./user')
var cors = require('cors')
const bodyParser = require("body-parser");


const app = express()
const port = 3000

app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

user = new User()
anchor = new AnchorApi()



app.post('/confirm', async (req, res) => {
  confirmHandler(req)
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

async function confirmHandler(req) {
  user.min = req.body.min_value;
  user.max = req.body.max_value;
  user.optimal = req.body.optimal_value;
  user.initialCollateral = req.body.collateral_value;
  user.collateral = (req.body.collateral_value == undefined) ? 10: req.body.collateral_value;
  user.calculate_current_loan()

  console.log(user);
  
  await anchor.convert_luna_to_bluna(Number(user.initialCollateral))
  await anchor.add_bluna_as_collateral(Number(user.initialCollateral * 0.99))
  await anchor.take_loan(Number(user.loan));
  await anchor.deposit_ust_to_earn(Number(user.loan) - 1);
  setInterval(secret_algorithm, 60000)
}

async function secret_algorithm() {
    debt_ratio = user.calculate_debt_ratio()
    if(!(debt_ratio > user.min && debt_ratio < user.max)) {
      let new_loan = user.calculate_current_loan()
      let difference = new_loan - user.loan
      // we update the actual loan in anchor
      
      // if diff == 0 -> nothing
      // if diff > 0 -> take out loan | borrowing more the difference
      if(difference > 0) {
        await anchor.take_loan(difference)
        await anchor.deposit_ust_to_earn(difference - 1)

      }else if(difference < 0) {

        await anchor.withdraw_ust_from_earn(abs(difference))
        await anchor.payback_loan(abs(difference) - 1)

      }
        // after taking out loan, we deposit on anchor
      // if diff < 0 -> pay back the abs(difference)
        // we have to withdraw the difference from anchor
  }
}
