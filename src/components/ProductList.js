import React, { useEffect, useState } from 'react';
import axios from 'axios';

function ProductList({ refresh }) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get('https://b0893827-e39d-4537-b172-9bb4f3b0d8c6-00-2e5a27ct7ql3n.sisko.replit.dev/api/products')
      .then((res) => setProducts(res.data))
      .catch((err) => console.error(err));
  }, [refresh]);

  return (
    <div className="card shadow p-4 mt-4">
      <h4 className="mb-3">📦 Product List</h4>
      {products.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered table-striped">
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Price (Rs)</th>
                <th>Quantity</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p, i) => (
                <tr key={p._id}>
                  <td>{i + 1}</td>
                  <td>{p.name}</td>
                  <td>{p.price}</td>
                  <td>{p.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ProductList;
