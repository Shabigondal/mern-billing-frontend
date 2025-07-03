import React, { useEffect, useState } from 'react';
import axios from 'axios';

function InvoiceForm({ onInvoiceAdded }) {
  const [products, setProducts] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [invoiceItems, setInvoiceItems] = useState([]);
  const [customerName, setCustomerName] = useState('');
  const [success, setSuccess] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    axios.get('https://b0893827-e39d-4537-b172-9bb4f3b0d8c6-00-2e5a27ct7ql3n.sisko.replit.dev/api/products')
      .then(res => setProducts(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleAddItem = () => {
    const product = products.find(p => p._id === selectedId);
    if (!product) return;

    setInvoiceItems([...invoiceItems, {
      name: product.name,
      price: product.price,
      quantity: parseInt(quantity),
      total: product.price * quantity
    }]);

    setSelectedId('');
    setQuantity(1);
  };

  const removeItem = (index) => {
    const updatedItems = [...invoiceItems];
    updatedItems.splice(index, 1);
    setInvoiceItems(updatedItems);
  };

  const handleSubmitInvoice = async () => {
    if (!customerName || invoiceItems.length === 0) {
      alert('Please enter customer name and add at least one item');
      return;
    }

    const invoiceData = {
      customerName,
      items: invoiceItems,
      totalAmount: invoiceItems.reduce((sum, item) => sum + item.total, 0)
    };

    try {
      await axios.post('https://b0893827-e39d-4537-b172-9bb4f3b0d8c6-00-2e5a27ct7ql3n.sisko.replit.dev/api/invoices', invoiceData);
      setSuccess(true);
      setCustomerName('');
      setInvoiceItems([]);
      setShowPreview(false);
      onInvoiceAdded();
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error(err);
      alert('Error saving invoice');
    }
  };

  return (
    <div className="card shadow p-4 mt-4">
      <h4 className="mb-3">🧾 Create Invoice</h4>

      {success && (
        <div className="alert alert-success">
          ✅ Invoice created successfully!
        </div>
      )}

      <div className="mb-3">
        <label>Customer Name</label>
        <input
          type="text"
          className="form-control"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          required
        />
      </div>

      <div className="row mb-3">
        <div className="col-md-6">
          <label>Select Product</label>
          <select
            className="form-select"
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
          >
            <option value="">-- Select --</option>
            {products.map((p) => (
              <option key={p._id} value={p._id}>
                {p.name} (Rs {p.price})
              </option>
            ))}
          </select>
        </div>

        <div className="col-md-3">
          <label>Quantity</label>
          <input
            type="number"
            className="form-control"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            min={1}
          />
        </div>

        <div className="col-md-3 d-flex align-items-end">
          <button className="btn btn-success w-100" onClick={handleAddItem}>
            Add to Invoice
          </button>
        </div>
      </div>

      {invoiceItems.length > 0 && (
        <>
          <table className="table table-bordered">
            <thead className="table-light">
              <tr>
                <th>Name</th>
                <th>Qty</th>
                <th>Price</th>
                <th>Total</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {invoiceItems.map((item, i) => (
                <tr key={i}>
                  <td>{item.name}</td>
                  <td>{item.quantity}</td>
                  <td>{item.price}</td>
                  <td>{item.total}</td>
                  <td>
                    <div className="d-flex justify-content-center">
                      <button
                        className="btn btn-outline-danger btn-sm px-3"
                        onClick={() => removeItem(i)}
                        title="Remove item"
                      >
                        ❌
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <h5 className="text-end">Total: Rs {invoiceItems.reduce((sum, item) => sum + item.total, 0)}</h5>

          <div className="d-flex justify-content-center mt-4">
            <button
              className="btn btn-primary px-5"
              onClick={() => {
                if (!customerName || invoiceItems.length === 0) {
                  alert('Please add customer name and at least one item.');
                  return;
                }
                setShowPreview(true);
              }}
            >
              Preview Invoice
            </button>
          </div>
        </>
      )}

      {/* ✅ Invoice Preview Modal */}
      {showPreview && (
        <div
          style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.6)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 9999
          }}
        >
          <div style={{
            background: '#fff',
            padding: 30,
            width: '90%',
            maxWidth: 600,
            borderRadius: 8
          }}>
            <h4>🧾 Invoice Preview</h4>
            <p><strong>Customer:</strong> {customerName}</p>
            <table className="table table-bordered mt-3">
              <thead>
                <tr>
                  <th>Item</th><th>Qty</th><th>Price</th><th>Total</th>
                </tr>
              </thead>
              <tbody>
                {invoiceItems.map((item, i) => (
                  <tr key={i}>
                    <td>{item.name}</td>
                    <td>{item.quantity}</td>
                    <td>{item.price}</td>
                    <td>{item.price * item.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <h5 className="text-end">Grand Total: Rs {invoiceItems.reduce((sum, item) => sum + item.total, 0)}</h5>

            <div className="mt-4 d-flex justify-content-end gap-2">
              <button className="btn btn-secondary" onClick={() => setShowPreview(false)}>Cancel</button>
              <button className="btn btn-success" onClick={handleSubmitInvoice}>Save Invoice</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default InvoiceForm;
