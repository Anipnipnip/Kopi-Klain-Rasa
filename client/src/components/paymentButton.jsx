import React from "react";

const PaymentButton = ({ transactionToken }) => {
  const handlePayment = () => {
    if (window.snap) {
      window.snap.embed(transactionToken, {
        embedId: "snap-container",
      });
    } else {
      console.error("Snap.js belum ke-load");
    }
  };

  return (
    <div>
      <button
        onClick={handlePayment}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Pay!
      </button>
      <div id="snap-container"></div>
    </div>
  );
};

export default PaymentButton;
