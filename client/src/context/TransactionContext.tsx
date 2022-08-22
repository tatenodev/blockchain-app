import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { createContext } from "react";
import { contractABI, contractAddress } from "../utils/connets";

const initialState = {
  connectWallet: () => null,
  sendTransaction: () => null,
  handleChange: () => null,
  inputFormData: { addressTo: "", amount: "" },
};

export const TransactionContext = createContext<{
  connectWallet: () => Promise<void> | null;
  sendTransaction: () => Promise<void> | null;
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement>,
    name: string
  ) => void | null;
  inputFormData: { addressTo: string; amount: string };
}>(initialState);

const { ethereum } = window;

const getSmartContract = () => {
  if (!ethereum) return;
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const transactionContract = new ethers.Contract(
    contractAddress,
    contractABI,
    signer
  );

  console.log(provider, signer, transactionContract);

  return transactionContract;
};

export const TransactionProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [currentAccount, setCurrentAccount] = useState("");
  const [inputFormData, setInputFormData] = useState({
    addressTo: "",
    amount: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    name: string
  ) => {
    setInputFormData((prev) => ({ ...prev, [name]: e.target.value }));
  };

  /** walletと連携しているかどうか */
  const checkMetamaskWalletConnected = async () => {
    if (!ethereum) return alert("メタマスクをインストールしてください");
    /** metamaskのアカウントid */
    const accounts = await ethereum.request({ method: "eth_accounts" });
    console.log(accounts);
  };

  /** walletと連携 */
  const connectWallet = async () => {
    if (!ethereum) return alert("メタマスクをインストールしてください");
    /** metamaskを持っていれば接続 */
    const accounts = await ethereum.request({ method: "eth_requestAccounts" });
    console.log(accounts[0]);
    setCurrentAccount(accounts[0]);
  };

  /** 通貨のやりとり */
  const sendTransaction = async () => {
    if (!ethereum) return alert("メタマスクをインストールしてください");
    console.log("sendTransaction");

    const transactionContract = getSmartContract();
    const { addressTo, amount } = inputFormData;
    const parsedAmount = ethers.utils.parseEther(amount);

    const transactionParams = {
      gas: "0x2710",
      to: addressTo,
      from: currentAccount,
      value: parsedAmount._hex,
    };

    const txHash = await ethereum.request({
      method: "eth_sendTransaction",
      params: [transactionParams],
    });

    if (!transactionContract) return;
    const transactionHash = await transactionContract.addToBlockChain(
      addressTo,
      parsedAmount
    );
    console.log("Loading...", transactionHash.hash);
    await transactionHash.wait();
    console.log("送金成功");
  };

  useEffect(() => {
    checkMetamaskWalletConnected();
  }, []);

  return (
    <TransactionContext.Provider
      value={{ connectWallet, sendTransaction, handleChange, inputFormData }}
    >
      {children}
    </TransactionContext.Provider>
  );
};
