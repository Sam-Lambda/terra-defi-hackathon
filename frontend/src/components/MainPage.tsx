import { LCDClient, MnemonicKey, Wallet } from '@terra-money/terra.js'
import { Anchor, columbus5, AddressProviderFromJson, MARKET_DENOMS, OperationGasParameters } from '@anchor-protocol/anchor.js'
import { Button, Dropdown } from "react-bootstrap";
import NumericInput from 'react-numeric-input';
import axios from 'axios';
import { QuerySample } from './QuerySample';
import { useConnectedWallet, useLCDClient } from '@terra-money/wallet-provider';
import React, { useEffect, useState } from 'react';


export function MainPage() {
  let min = 1
  let optimal = 45
  let max = 99

  const lcd = useLCDClient();
  const connectedWallet = useConnectedWallet();

  const [bank, setBank] = useState<null | string>();

  useEffect(() => {
    if (connectedWallet) {
      lcd.bank.balance(connectedWallet.walletAddress).then(([coins]) => {
        setBank(coins.toString());
      });
    } else {
      setBank(null);
    }
  }, [connectedWallet, lcd]);

  const [numField, setNumfield] = useState(0);

  function max_terra_in_wallet() {
    if(bank) {
      let coins = bank.split(',')
      let terra = coins[0]
      let num = terra.replace('uluna', '')
      return parseFloat(num);
    }
    
    return 0;
  }

  return (
    <div>
      <h1>bAnchor Protocol</h1>

      <div id="min-max-container">
        <div>Min (%)</div>
        <NumericInput
          min={0}
          max={max}
          value={min}
          onChange={
            (value) => {
              min = value!;
            }
          }></NumericInput>
        <div>Optimal (%)</div>
        <NumericInput
          min={min}
          max={100}
          value={optimal}
          onChange={
            (value) => {
              optimal = value!
            }
          }></NumericInput>
        <div>Max (%)</div>
        <NumericInput
          min={min}
          max={100}
          value={max}
          onChange={(
            value) => {
            max = value!
          }
          }></NumericInput>

        <div id='terra-div'>
        <NumericInput
          min={0}
          max={max_terra_in_wallet()}
          value={numField}
          onChange={(value) => {
            if(value) {
              setNumfield(value);
            }
          }
          }></NumericInput>
          <button onClick={() => {
            setNumfield(max_terra_in_wallet() / 1000000);
          }}>Max</button>
        </div>
      </div>

      <Button 
        variant="primary" 
        onClick={
          () => {
            console.log(numField)
            axios.post("http://localhost:3000/confirm", {
              min_value: min,
              max_value: max,
              optimal_value: optimal,
              collateral_value: numField
            })
          }
        }>Confirm</Button>

    </div>
  );
}