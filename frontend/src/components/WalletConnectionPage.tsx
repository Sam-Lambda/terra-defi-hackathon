import { useWallet, WalletStatus } from '@terra-money/wallet-provider';
import React from 'react';
import { useNavigate } from 'react-router-dom';


export function WalletConnectionPage() {
  const {
    status,
    network,
    wallets,
    availableConnectTypes,
    availableInstallTypes,
    availableConnections,
    supportFeatures,
    connect,
    disconnect,
  } = useWallet();

  let navigate = useNavigate();


  return (
    <div>
      <h1>Connect Sample</h1>
      <section>
        <pre>
          {JSON.stringify(
            {
              status,
              network,
              wallets,
              supportFeatures: Array.from(supportFeatures),
              availableConnectTypes,
              availableInstallTypes,
            },
            null,
            2,
          )}
        </pre>
      </section>
      <h1>Connect Wallet</h1>
      <footer>
        {status === WalletStatus.WALLET_NOT_CONNECTED && (
          <>
            {availableConnectTypes.map((connectType) => (
              <button
                key={'connect-' + connectType}
                onClick={() => {
                  connect(connectType)
                }}
              >
                Connect {connectType}
              </button>
            ))}
            <br />
            {availableConnections.map(
              ({ type, name, icon, identifier = '' }) => (
                <button
                  key={'connection-' + type + identifier}
                  onClick={() => connect(type, identifier)}
                >
                  <img
                    src={icon}
                    alt={name}
                    style={{ width: '1em', height: '1em' }}
                  />
                  {name} [{identifier}]
                </button>
              ),
            )}
          </>
        )}
        {status === WalletStatus.WALLET_CONNECTED && (
          <div>
            <button onClick={() => disconnect()}>Disconnect</button>
            <button onClick={() => navigate("/app")}>Next</button>
          </div>
          
        )}
      </footer>
    </div>
  );
}
