import { useContext } from "react";
import { TransactionContext } from "../context/TransactionContext";

export const Main = () => {
  const { connectWallet, sendTransaction, handleChange, inputFormData } =
    useContext(TransactionContext);

  const handleSubmit = () => {
    const { addressTo, amount } = inputFormData;
    if (addressTo === "" || amount === "") return;
    sendTransaction();
  };

  return (
    <div>
      <div>
        <h1>Crypt Card</h1>
        <button onClick={connectWallet}>ウォレット連携</button>
      </div>
      <div>
        <input
          type="text"
          placeholder="address"
          name="addressTo"
          onChange={(e) => handleChange(e, e.target.name)}
        />
        <input
          type="number"
          placeholder="eth"
          name="amount"
          step="0.0001"
          onChange={(e) => handleChange(e, e.target.name)}
        />
        <button type="button" onClick={handleSubmit}>
          送信
        </button>
      </div>
    </div>
  );
};
