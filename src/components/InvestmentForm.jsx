// src/InvestmentForm.js
import React, { useState } from "react";
import "./InvestmentForm.css";

function InvestmentForm() {
  const [initialInvestment, setInitialInvestment] = useState(0);
  const [discountRate, setDiscountRate] = useState(0);
  const [cashFlows, setCashFlows] = useState([0,0]);
  const [results, setResults] = useState({
    netProfit: 0,
    roi: 0,
    paybackPeriod: 0,
    npv: 0,
  });

  const handleAddYear = () => {
    setCashFlows([...cashFlows, 0]);
  };

const calculateResults = () => {
  const netProfit = cashFlows.reduce((acc, cf) => acc + cf, -initialInvestment);
  const roi = (netProfit / cashFlows.length + 1)/initialInvestment * 100;

  let cumulativeCashFlow = -initialInvestment;
  let paybackPeriod = cashFlows.length + 1; // Default to a value greater than the number of years

  for (let i = 0; i < cashFlows.length; i++) {
    cumulativeCashFlow += cashFlows[i];
    if (cumulativeCashFlow >= 0) {
      paybackPeriod = i + 1; // Payback period is the first year when cumulative cash flow becomes positive
      break;
    }
  }

  let npv = -initialInvestment; // Initialize NPV with the initial investment as a negative cash flow

  for (let t = 0; t < cashFlows.length; t++) {
    npv += cashFlows[t] / Math.pow(1 + (discountRate/100), t);
  }

  setResults({ netProfit, roi, paybackPeriod, npv });
};



  return (
    <div className='investment-form'>
      <h1 style={{ fontWeight: 700, fontSize: 22 }}>Investment Analysis</h1>
      <div className='input-fields'>
        <label for='iinv'>Initial Investment:</label>
        <input
          name='iinv'
          type='number'
          value={initialInvestment}
          onChange={(e) => setInitialInvestment(parseFloat(e.target.value))}
        />
        <label for='discount'>Discount Rate:</label>
        <input
          name='discount'
          type='number'
          value={discountRate}
          onChange={(e) => setDiscountRate(parseFloat(e.target.value))}
        />
      </div>
      <div className='cash-flows'>
        <label style={{ marginBottom: 10 }}>Cash Flows:</label>
        <ul>
          {cashFlows.map((cf, index) => (
            <li key={index}>
              Year {index + 1}:{" "}
              <input
                type='number'
                value={cf}
                onChange={(e) => {
                  const updatedCashFlows = [...cashFlows];
                  updatedCashFlows[index] = parseFloat(e.target.value);
                  setCashFlows(updatedCashFlows);
                }}
              />
            </li>
          ))}
        </ul>
        <button onClick={handleAddYear}>Add Year</button>
      </div>
      <button onClick={calculateResults}>Calculate</button>
      <div className='results'>
        <h3 style={{ marginBottom: 10 }}>Results</h3>
        <p style={{ marginBottom: 20 }}>
          Net Profit:{" "}
          <span style={{ padding: 7, background: "white" }}>
            ${results.netProfit.toFixed(2)}
          </span>
        </p>
        <p style={{ marginBottom: 20 }}>
          Return on Investment (ROI):{" "}
          <span style={{ padding: 7, background: "white" }}>
            {results.roi.toFixed(2)}%
          </span>
        </p>
        <p style={{ marginBottom: 20 }}>
          Payback Period:{" "}
          <span style={{ padding: 7, background: "white" }}>
            {results.paybackPeriod === cashFlows.length + 1
              ? "N/A"
              : results.paybackPeriod + " years"}
          </span>
        </p>
        <p style={{ marginBottom: 20 }}>
          Net Present Value (NPV):{" "}
          <span style={{ padding: 7, background: "white" }}>
            ${results.npv.toFixed(2)}
          </span>
        </p>
      </div>{" "}
    </div>
  );
}

export default InvestmentForm;
