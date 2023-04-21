import React, { useState } from "react";
import { Button, Input, message } from "antd";
import { ethers } from "ethers";
import detectEthereumProvider from "@metamask/detect-provider";

import "./App.css";

const App: React.FC = () => {
  const [provider, setProvider] = useState<ethers.providers.Web3Provider>();
  const [address, setAddress] = useState<string>();
  const [messageToSign, setMessageToSign] = useState<string>("");
  const [signature, setSignature] = useState<string>("");

  const connectWallet = async () => {
    const provider = await detectEthereumProvider();
    if (provider) {
      const newProvider = new ethers.providers.Web3Provider(provider);
      try {
        const signer = newProvider.getSigner();
        const newAddress = await signer.getAddress();
        setProvider(newProvider);
        setAddress(newAddress);
      } catch (error) {
        message.error("Failed to connect wallet.");
        console.error(error);
      }
    } else {
      message.error("Metamask not found. Please install Metamask first.");
    }
  };

  const disconnectWallet = () => {
    setProvider(undefined);
    setAddress(undefined);
  };

  const signMessage = async () => {
    if (provider && messageToSign) {
      try {
        const signer = provider.getSigner();
        const signature = await signer.signMessage(messageToSign);
        setSignature(signature);
      } catch (error) {
        message.error("Failed to sign message.");
        console.error(error);
      }
    } else {
      message.warning("Please connect wallet and enter message to sign.");
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <Button
          type="primary"
          onClick={provider ? disconnectWallet : connectWallet}
        >
          {provider ? "Disconnect Wallet" : "Connect Wallet"}
        </Button>
        {address && <span className="Wallet-address">{address}</span>}
      </header>
      <main className="App-main">
        <Input.TextArea
          placeholder="Enter message to sign"
          autoSize={{ minRows: 3, maxRows: 6 }}
          value={messageToSign}
          onChange={(e) => setMessageToSign(e.target.value)}
        />
        <Button type="primary" className="SignButton" onClick={signMessage}>
          Sign Message
        </Button>
        {signature && (
          <div className="Signature">
            <h3>Signature:</h3>
            <p>{signature}</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;