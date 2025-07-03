import React from 'react';
import './Dashboard.css'; // optional for custom styles

function Dashboard({ setSection }) {
  const boxes = [
    { label: 'Add Product', icon: '📦', key: 'product' },
    { label: 'Create Invoice', icon: '🧾', key: 'invoice' },
    { label: 'Sales Report', icon: '📊', key: 'report' },
    { label: 'Products', icon: '🗂️', key: 'products' }
  ];

  return (
    <div className="container mt-4">
      <div className="row g-4">
        {boxes.map((box, idx) => (
          <div key={idx} className="col-md-3">
            <div
              className="card text-center shadow-sm p-3 hover-effect"
              onClick={() => setSection(box.key)}
              style={{ cursor: 'pointer' }}
            >
              <div style={{ fontSize: '2rem' }}>{box.icon}</div>
              <h5 className="mt-2">{box.label}</h5>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
