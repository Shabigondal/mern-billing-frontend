import React, { useState } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import AddProduct from './components/AddProduct';
import ProductList from './components/ProductList';
import InvoiceForm from './components/InvoiceForm';
import InvoiceList from './components/InvoiceList';
// ...
<InvoiceList />



function App() {
  const [user, setUser] = useState(null);
  const [section, setSection] = useState('dashboard');
  const [refresh, setRefresh] = useState(0);

  if (!user) return <Login onLogin={setUser} />;

  const renderSection = () => {
    switch (section) {
      case 'product':
        return <AddProduct onProductAdded={() => setRefresh(refresh + 1)} />;
      case 'invoice':
        return <InvoiceForm onInvoiceAdded={() => setRefresh(refresh + 1)} />;
      case 'products':
        return <ProductList refresh={refresh} />;
      case 'report':
      return <InvoiceList />;
      default:
        return <Dashboard setSection={setSection} />;
    }
  };

  return (
    <div className="App">
      <header className="d-flex justify-content-between align-items-center p-3 bg-light shadow-sm">
  <div className="d-flex align-items-center gap-3">
    <h4 style={{ margin: 0 }}>🧾 MyCompany Billing</h4>
    <button className="btn btn-sm btn-outline-primary" onClick={() => setSection('dashboard')}>
      🏠 Dashboard
    </button>
  </div>
  <div>
    <span className="me-3">👤 {user.name}</span>
    <button className="btn btn-sm btn-outline-danger" onClick={() => {
      setUser(null);
      setSection('dashboard');
    }}>
      Logout
    </button>
  </div>
</header>


      <div className="container mt-4">{renderSection()}</div>
    </div>
  );
}

export default App;
