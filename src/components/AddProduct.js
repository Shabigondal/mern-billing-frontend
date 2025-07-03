import React, { useState } from 'react';
import axios from 'axios';

function AddProduct({ onProductAdded }) {
  const [productName, setProductName] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('https://b0893827-e39d-4537-b172-9bb4f3b0d8c6-00-2e5a27ct7ql3n.sisko.replit.dev/api/products', {
        name: productName,
        price: parseFloat(price),
        quantity: parseInt(quantity),
      });
      setSuccess(true);
      setProductName('');
      setPrice('');
      setQuantity('');
      onProductAdded();
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error(err);
      alert('Error adding product');
    }
  };

  return (
    <div className="card shadow p-4">
      <h4 className="mb-3">➕ Add New Product</h4>

      {success && (
        <div className="alert alert-success" role="alert">
          ✅ Product added successfully!
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Product Name</label>
          <input
            type="text"
            className="form-control"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label>Price (Rs)</label>
          <input
            type="number"
            className="form-control"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label>Quantity</label>
          <input
            type="number"
            className="form-control"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary w-100">Add Product</button>
      </form>
    </div>
  );
}

export default AddProduct;
