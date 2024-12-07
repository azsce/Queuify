import React from 'react';

const DD1Results = ({ results }) => {
  return (
    <div>
      {results.t1 !== undefined ? (
        <p>Time of first balk (t1): {results.t1}</p>
      ) : (
        <>
          <p>System utilization (ρ): {results.rho}</p>
          <p>Probability of 0 customers (P0): {results.P0}</p>
          <p>Average number of customers in the system (L): {results.L}</p>
          <p>Average number of customers in the queue (Lq): {results.Lq}</p>
          <p>Average time a customer spends in the system (W): {results.W}</p>
          <p>Average time a customer spends in the queue (Wq): {results.Wq}</p>
        </>
      )}
    </div>
  );
};

export default DD1Results;