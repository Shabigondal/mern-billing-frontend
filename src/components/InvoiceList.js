import React, { useEffect, useState } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import autoTable from 'jspdf-autotable';




function InvoiceList() {
  const [invoices, setInvoices] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    axios.get('https://b0893827-e39d-4537-b172-9bb4f3b0d8c6-00-2e5a27ct7ql3n.sisko.replit.dev/api/invoices')
      .then(res => setInvoices(res.data))
      .catch(err => console.error(err));
  }, []);

  const handlePrint = (invoice) => {
    const win = window.open('', '_blank');
    win.document.write(`
      <html>
      <head>
        <title>Invoice</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            padding: 20px;
            color: #000;
          }
          h2 {
            margin-bottom: 0;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 15px;
          }
          th, td {
            border: 1px solid #333;
            padding: 8px;
            text-align: left;
          }
          th {
            background-color: #f5f5f5;
          }
          .total {
            text-align: right;
            margin-top: 20px;
            font-size: 18px;
          }
        </style>
      </head>
      <body>
        <img src="/logo.png" alt="Logo" height="80" />
        <p><strong>Customer:</strong> ${invoice.customerName || 'N/A'}</p>
        <p><strong>Date:</strong> ${new Date(invoice.date).toLocaleString()}</p>
        <table>
          <thead>
            <tr>
              <th>Item</th>
              <th>Qty</th>
              <th>Price</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            ${invoice.items.map(item => `
              <tr>
                <td>${item.name}</td>
                <td>${item.quantity}</td>
                <td>${item.price}</td>
                <td>${item.price * item.quantity}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        <p class="total"><strong>Grand Total:</strong> Rs ${invoice.totalAmount}</p>
      </body>
      </html>
    `);
    win.document.close();
    win.print();
  };

const handleDelete = async (id) => {
  console.log('Deleting invoice ID:', id); // 👈 Add this

  if (!window.confirm('Are you sure you want to delete this invoice?')) return;
  try {
    await axios.delete(`https://b0893827-e39d-4537-b172-9bb4f3b0d8c6-00-2e5a27ct7ql3n.sisko.replit.dev/api/invoices/${id}`);
    setInvoices(invoices.filter(inv => inv._id !== id));
  } catch (err) {
    console.error('Frontend delete error:', err.response?.data || err.message);
    alert('Failed to delete invoice');
  }
};



  return (
    <div className="card shadow p-4 mt-4">
      <h4 className="mb-3">📃 Invoice List</h4>
      {invoices.length === 0 ? (
        <p>No invoices yet.</p>
      ) : (
        <div className="table-responsive">
          <div className="mb-3">
  <input
    type="text"
    className="form-control"
    placeholder="Search by customer name..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
  />
</div>

          <table className="table table-striped table-bordered">
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Total Amount</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
            {invoices
            .filter(invoice =>
            invoice.customerName.toLowerCase().includes(searchTerm.toLowerCase())
           )
           .map((invoice, i) => (

                <tr key={invoice._id}>
                  <td>{i + 1}</td>
                  <td>{invoice.customerName}</td>
                  <td>{new Date(invoice.date).toLocaleString()}</td>
                  <td>Rs {invoice.totalAmount}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-primary me-2"
                      onClick={() => handlePrint(invoice)}
                    >
                      🖨 Print
                    </button>
                   <button 
                   className="btn btn-sm btn-danger me-2"
                   onClick={() => handleDownloadPDF(invoice)}
>
                    ⬇ PDF
                    </button>

                     <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(invoice._id)}
                      >
                     🗑 Delete
                     </button>

                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}



const handleDownloadPDF = (invoice) => {
  const doc = new jsPDF();
  const img = new Image();

  img.src = '/logo.png';

  img.onload = () => {
    // ✅ Add logo on top-left
    doc.addImage(img, 'PNG', 14, 10, 40, 20); // x=14 to align with text

    // Add content below the logo
    let topY = 35; // adjust based on logo height

    doc.setFontSize(16);
    doc.text('Invoice', 14, topY);
    doc.setFontSize(12);
    doc.text(`Customer: ${invoice.customerName}`, 14, topY + 10);
    doc.text(`Date: ${new Date(invoice.date).toLocaleString()}`, 14, topY + 17);

    const tableData = invoice.items.map(item => [
      item.name,
      item.quantity,
      item.price,
      item.price * item.quantity
    ]);

    autoTable(doc, {
      startY: topY + 25,
      head: [['Item', 'Qty', 'Price', 'Total']],
      body: tableData
    });

    doc.text(`Grand Total: Rs ${invoice.totalAmount}`, 14, doc.lastAutoTable.finalY + 10);

    doc.save(`Invoice_${invoice.customerName || 'Customer'}.pdf`);
  };

  img.onerror = () => {
    alert("Logo failed to load. Make sure logo.png is in public folder.");
  };
};



export default InvoiceList;
