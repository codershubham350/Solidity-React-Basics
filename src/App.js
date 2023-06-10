/* eslint-disable react/jsx-no-target-blank */
import { useEffect, useState, useCallback } from "react";
import Web3 from "web3";
import detectEthereumProvider from "@metamask/detect-provider";
import { loadContract } from "./utils/load-contract";
import "./App.css";

function App() {
  const [web3Api, setWeb3Api] = useState({
    provider: null,
    isProviderLoaded: false,
    web3: null,
    contract: null,
  });

  const [balance, setBalance] = useState(null);
  const [account, setAccount] = useState(null);
  const [shouldReload, setShouldReload] = useState(false);

  const canConnectToContract = account && web3Api.contract;
  const reloadEffect = useCallback(
    () => setShouldReload(!shouldReload),
    [shouldReload]
  );

  const setAccountListener = (provider) => {
    // provider.on("accountsChanged", (accounts) => setAccount(accounts[0]));
    provider.on("accountsChanged", () => window.location.reload());
    provider.on("chainChanged", () => window.location.reload());

    // provider._jsonRpcConnection.events.on("notification", (payload) => {
    //   const { method } = payload;

    //   if (method === "metamask_unlockStateChanged") {
    //     setAccount(null);
    //   }
    // });
  };

  useEffect(() => {
    // const iframe = document.getElementsByTagName("iframe");
    // console.log("iframe", document.getElementsByTagName("iframe"));
    const iframe = document.querySelector("iframe");
    if (iframe) {
      iframe.style.display = "none";
    }
  }, []);

  useEffect(() => {
    const loadProvider = async () => {
      const provider = await detectEthereumProvider();
      // const web3 = new Web3(provider);
      // with metamask we have an access to window.ethereum and to window.web3
      // metamask injects a global API into website
      // this API allows website to request users, accounts, read data to blockchain
      // sign messages and transactions

      if (provider) {
        const contract = await loadContract("Faucet", provider);
        setAccountListener(provider);
        // provider.request({ method: "eth_requestAccounts" });
        setWeb3Api({
          web3: new Web3(provider),
          provider,
          contract,
          isProviderLoaded: true,
        });
      } else {
        setWeb3Api((web3Api) => ({
          ...web3Api,
          isProviderLoaded: true,
        }));
        console.error("Please, install Metamask.");
      }
      // if (window.ethereum) {
      //   provider = window.ethereum;

      //   try {
      //     await provider.request({ method: "eth_requestAccounts" });
      //   } catch {
      //     console.error("User denied account access");
      //   }
      // } else if (window.web3) {
      //   provider = window.web3.currentProvider;
      // } else if (!process.env.production) {
      //   provider = new Web3.providers.HttpProvider("http://localhost:7545");
      // }

      // console.log(window.web3);
      // console.log(window.ethereum);
    };
    loadProvider();
  }, []);

  useEffect(() => {
    const loadBalance = async () => {
      const { contract, web3 } = web3Api;
      const balance = await web3?.eth?.getBalance(contract.address);
      setBalance(web3?.utils?.fromWei(balance, "ether"));
    };
    loadBalance();
  }, [web3Api, shouldReload]);

  useEffect(() => {
    const getAccount = async () => {
      const accounts = await web3Api.web3.eth.getAccounts();
      setAccount(accounts[0]);
    };

    web3Api.web3 && getAccount();
  }, [web3Api.web3]);

  const addFunds = useCallback(async () => {
    const { contract, web3 } = web3Api;
    await contract.addFunds({
      from: account,
      value: web3.utils.toWei("1", "ether"),
    });
    //window.location.reload()
    reloadEffect();
  }, [web3Api, account, reloadEffect]);

  const withdraw = async () => {
    const { contract, web3 } = web3Api;
    const withdrawAmount = web3.utils.toWei("0.1", "ether");
    await contract.withdraw(withdrawAmount, {
      from: account,
    });
    //window.location.reload()
    reloadEffect();
  };

  return (
    <>
      <div className="faucet-wrapper">
        <div className="faucet">
          {web3Api.isProviderLoaded ? (
            <div className="is-flex is-align-items-center">
              <span>
                <strong className="mr-2">Account: </strong>
              </span>

              {account ? (
                <span>{account}</span>
              ) : !web3Api.provider ? (
                <>
                  <div className="notification is-warning is-size-6 is-rounded">
                    Wallet is not detected!{" "}
                    <a
                      rel="noreferrer"
                      href="https://docs.metamask.io"
                      target="_blank"
                    >
                      Install Metamask
                    </a>
                  </div>
                </>
              ) : (
                <button
                  className="button is-small"
                  onClick={() =>
                    web3Api.provider.request({ method: "eth_requestAccounts" })
                  }
                >
                  Connect Wallet
                </button>
              )}
            </div>
          ) : (
            <span> Looking for Web3...</span>
          )}

          <div className="balance-view is-size-2 my-4">
            Current Balance: <strong>{balance ? balance : ""}</strong> ETH
          </div>
          {!canConnectToContract && (
            <i className="is-block">Connect to Ganache</i>
          )}

          <button
            disabled={!canConnectToContract}
            onClick={addFunds}
            className="button is-link mr-2"
          >
            Donate 1 ETH
          </button>
          <button
            disabled={!canConnectToContract}
            className="button is-primary"
            onClick={withdraw}
          >
            Withdraw 0.1 ETH
          </button>
        </div>
      </div>
    </>
  );
}

export default App;
