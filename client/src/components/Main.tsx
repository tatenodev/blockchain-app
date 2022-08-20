export const Main = () => {
  return (
    <div>
      <div>
        <h1>Crypt Card</h1>
        <button>ウォレット連携</button>
      </div>
      <div>
        <input type="text" placeholder="address" name="addressTo" />
        <input type="number" placeholder="eth" name="amount" step="0.0001" />
        <button type="button">送信</button>
      </div>
    </div>
  );
};
