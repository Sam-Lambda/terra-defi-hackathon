const { LCDClient, MnemonicKey, Fee, Wallet } = require('@terra-money/terra.js')
const { Anchor, bombay12, AddressProviderFromJson, MARKET_DENOMS, OperationGasParameters, BAssetAddressProviderImpl, bAssetAddressesBombay12 } = require('@anchor-protocol/anchor.js')
const { default: axios } = require('axios')


class AnchorApi {
    
    constructor() {

        this.gasParameters = {
            gasAdjustment: 2,
            gasPrices: "0.456uusd"
        }

        this.get_current_anchor_collateral_url = "https://bombay-lcd.terra.dev/terra/wasm/v1beta1/contracts/terra1ltnkx0mv7lf2rca9f8w740ashu93ujughy4s7p/store?query_msg=eyJib3Jyb3dlciI6eyJhZGRyZXNzIjoidGVycmExdzhndGcyMmw3Znh5eWU0ZHIzdDQ4OXdsZWo4d2cydTh6aHl5Y2oifX0%3D"
        this.get_current_wallet_amount = "https://bombay-lcd.terra.dev/cosmos/bank/v1beta1/balances/terra1w8gtg22l7fxyye4dr3t489wlej8wg2u8zhyycj"
        this.get_current_bluna_price = "https://bombay-lcd.terra.dev/terra/wasm/v1beta1/contracts/terra1p4gg3p2ue6qy2qfuxtrmgv2ec3f4jmgqtazum8/store?query_msg=eyJwcmljZSI6eyJiYXNlIjoidGVycmExdTB0MzVkcnp5eTBtdWpqOHJrZHl6aGUyNjR1bHM0dWczd2RwM3giLCJxdW90ZSI6InV1c2QifX0="
        this.addressProvider = new AddressProviderFromJson(bombay12);
        this.lcd = new LCDClient({ URL: 'https://bombay-lcd.terra.dev', chainID: 'bombay-12' });
        this.key = new MnemonicKey({
            mnemonic: 'member best space hair shoot track meat banana waste avoid chicken salmon plate wife imitate file region heart travel busy north foil sunset wonder'
        });
        this.wallet = new Wallet(this.lcd, this.key);
        this.anchor = new Anchor(this.lcd, this.addressProvider);
    }

    // we need to convert luna to bluna
    async convert_luna_to_bluna(amount_in_luna) {    
        let sufficient_fund = false;
        console.log("Converting luna to bLuna")
        const axios = require('axios').default;
        await axios.get(this.get_current_wallet_amount).then((value) => {
            sufficient_fund = value.data.balances[1].amount > amount_in_luna * 1000000
            console.log('current_fund = ' + value.data.balances[1].amount);
        })

        if(sufficient_fund) {
            try {
                const operation = await this.anchor.bluna.mint({amount: amount_in_luna});
                const tx_result = await operation.execute(this.wallet, this.gasParameters);
                console.log(tx_result.data);
                console.log(amount_in_luna + " luna has been minted to bLuna")
            }catch(e) {
                console.log("Retrying converting luma to bluma", e)
                this.convert_luna_to_bluna(amount_in_luna)
            }    
        }else {
            console.log('Insufficient funds')
        }
        console.log("Finished conversion")
    }

    // we need to put bluna as collateral
    async add_bluna_as_collateral(amount_in_luna) {
        console.log("Adding bLuna to Anchor", amount_in_luna)
        try {
            const operation = await this.anchor.borrow.provideCollateral({market: MARKET_DENOMS.UUSD, amount: amount_in_luna, bAsset: new BAssetAddressProviderImpl(
            bAssetAddressesBombay12.bLUNA)});
            const tx_result = await operation.execute(this.wallet, this.gasParameters);

            console.log(tx_result.data);
            console.log(amount_in_luna + "bLuna has been deposited as collateral")
        }catch(e) {
            console.log("Retrying adding bLuma as collateral", e)
            this.add_bluna_as_collatoral(amount_in_luna);
        }
        console.log("Finished adding bLuna")
    }

    // we need to take out a loan
    async take_loan(amount) {
        console.log("Start loan taking", amount)
        try {
            const operation = await this.anchor.borrow.borrow({market: MARKET_DENOMS.UUSD, amount: amount, to: "terra1w8gtg22l7fxyye4dr3t489wlej8wg2u8zhyycj"})
            const tx_result = await operation.execute(this.wallet, this.gasParameters);

            console.log(tx_result.data);
            console.log(amount + ' has been borrowed')
        }catch(e) {
            console.log('Retrying borrowing money', e)
            this.take_loan(amount)
        }
        console.log("Finished loan taking")
    }

    async deposit_ust_to_earn(amount) {
        console.log("Deposit UST to earn on Anchor", amount)
        try {
            const operation = await this.anchor.earn.depositStable({market: MARKET_DENOMS.UUSD, amount: amount});
            const tx_result = await operation.execute(this.wallet, this.gasParameters);

            console.log(tx_result.data);
            console.log(amount + ' has been been deposited to earn')

        } catch(e) {
            console.log('Retrying depositing money to earn');
            this.deposit_ust_to_earn(amount);
        }
        console.log("Finished depositing UST to earn on Anchor")
    }


    async withdraw_ust_from_earn(amount) {
        console.log("Started withdrawal from earn", amount)
        try {
            const operation = await this.anchor.earn.withdrawStable({market: MARKET_DENOMS.UUSD, amount: amount});
            const tx_result = await operation.execute(this.wallet, this.gasParameters);

            console.log(tx_result.data);
            console.log(amount + ' UST has been claimed from earn');
        }catch(e) {
            console.log('Retrying claiming money from earn');
            this.withdraw_ust_from_earn(amount);
        }
        console.log("Finished withdrawal from earn")
    }
    // we need to payback loans
    async pay_back_loan(amount) {
        console.log("Started paying back loans")
        try {
            const operation = await this.anchor.borrow.repay({market: MARKET_DENOMS.UUSD, amount: amount})
            const tx_result = await operation.execute(this.wallet, this.gasParameters);

            console.log(tx_result.data);
            console.log(amount + 'UST has been payed back');
        }catch(e) {
            console.log(e)
            console.log('Retrying to pay back loan');
            this.pay_back_loan(amount);
        }
        console.log("Finished paying back loans")
    }

    async close_position() {
        const total_value = await this.anchor.earn.getTotalDeposit({address: "terra1w8gtg22l7fxyye4dr3t489wlej8wg2u8zhyycj", market: MARKET_DENOMS.UUSD})
        console.log(total_value)
        await this.withdraw_ust_from_earn(total_value)
        const loan = await this.anchor.borrow.getBorrowedValue({address: "terra1w8gtg22l7fxyye4dr3t489wlej8wg2u8zhyycj", market: MARKET_DENOMS.UUSD})
        console.log(loan)
        this.pay_back_loan(loan)
        
        const axios = require('axios').default;
        
        let n_bLuna;      
        axios.get(anchor.get_current_anchor_collateral_url).then(function(response) {
            console.log(response.data.query_result.balance)
            n_bLuna = response.data.query_result.balance;
        }).catch(function(error) {
            console.log(error)
        });
        console.log(n_bLuna)
        const operation = await this.anchor.bluna.burn({amount: n_bLuna})
        const tx = await operation.execute(this.wallet, this.gasParameters)

        console.log(tx.data)
    }
}

module.exports = AnchorApi;