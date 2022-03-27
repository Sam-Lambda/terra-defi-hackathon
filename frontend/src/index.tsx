import { getChainOptions, WalletProvider } from '@terra-money/wallet-provider';
import { WalletConnectionPage } from 'components/WalletConnectionPage';
import { CW20TokensSample } from 'components/CW20TokensSample';
import { NetworkSample } from 'components/NetworkSample';
import { QuerySample } from 'components/QuerySample';
import { SignBytesSample } from 'components/SignBytesSample';
import { SignSample } from 'components/SignSample';
import { TxSample } from 'components/TxSample';
import React from 'react';
import ReactDOM from 'react-dom';
import './style.css';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { MainPage } from 'components/MainPage';
import 'bootstrap/dist/css/bootstrap.min.css';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<WalletConnectionPage/>}></Route>
        <Route path='/app' element={<MainPage/>}></Route>
      </Routes>
    </BrowserRouter>
    
  );
}

getChainOptions().then((chainOptions) => {
  ReactDOM.render(
    <WalletProvider {...chainOptions}>
      <App />
    </WalletProvider>,
    document.getElementById('root'),
  );
});
