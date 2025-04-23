import React, { useState, useEffect } from 'react';
import './styles.css';

function App() {
  const [inventory, setInventory] = useState([]);
  const [formData, setFormData] = useState({
    productId: '',
    category: 'Fruits',
    productName: '',
    quantity: '',
    mrp: '',
    sellingPrice: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('inventory');

  // Load data from localStorage on initial render
  useEffect(() => {
    const savedInventory = localStorage.getItem('groceryInventory');
    if (savedInventory) {
      setInventory(JSON.parse(savedInventory));
    }
  }, []);

  // Save to localStorage whenever inventory changes
  useEffect(() => {
    localStorage.setItem('groceryInventory', JSON.stringify(inventory));
  }, [inventory]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const validateForm = () => {
    if (!formData.productId.trim()) {
      alert('Product ID is required');
      return false;
    }
    if (!formData.productName.trim()) {
      alert('Product Name is required');
      return false;
    }
    if (!formData.quantity || isNaN(formData.quantity) || formData.quantity <= 0) {
      alert('Please enter a valid quantity');
      return false;
    }
    if (!formData.mrp || isNaN(formData.mrp) || formData.mrp <= 0) {
      alert('Please enter a valid MRP');
      return false;
    }
    if (!formData.sellingPrice || isNaN(formData.sellingPrice) || formData.sellingPrice <= 0) {
      alert('Please enter a valid Selling Price');
      return false;
    }
    if (parseFloat(formData.sellingPrice) > parseFloat(formData.mrp)) {
      alert('Selling Price cannot be greater than MRP');
      return false;
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (isEditing) {
      // Update existing item
      setInventory(inventory.map(item => 
        item.productId === formData.productId ? formData : item
      ));
      setIsEditing(false);
    } else {
      // Add new item
      if (inventory.some(item => item.productId === formData.productId)) {
        alert('Product ID already exists');
        return;
      }
      setInventory([...inventory, formData]);
    }

    // Reset form
    setFormData({
      productId: '',
      category: 'Fruits',
      productName: '',
      quantity: '',
      mrp: '',
      sellingPrice: ''
    });
  };

  const handleReset = () => {
    setFormData({
      productId: '',
      category: 'Fruits',
      productName: '',
      quantity: '',
      mrp: '',
      sellingPrice: ''
    });
    setIsEditing(false);
  };

  const handleEdit = (productId) => {
    const itemToEdit = inventory.find(item => item.productId === productId);
    if (itemToEdit) {
      setFormData(itemToEdit);
      setIsEditing(true);
      setActiveTab('add');
    }
  };

  const handleDelete = (productId) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      setInventory(inventory.filter(item => item.productId !== productId));
    }
  };

  return (
    <div className="app">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="container">
        {activeTab === 'inventory' && (
          <InventoryList 
            inventory={inventory} 
            onEdit={handleEdit} 
            onDelete={handleDelete} 
          />
        )}
        
        {activeTab === 'add' && (
          <InventoryForm 
            formData={formData} 
            isEditing={isEditing}
            onInputChange={handleInputChange} 
            onSubmit={handleSubmit} 
            onReset={handleReset} 
          />
        )}
        
        {activeTab === 'home' && (
          <Home />
        )}
      </div>
    </div>
  );
}

const Navbar = ({ activeTab, setActiveTab }) => {
  return (
    <nav className="navbar">
      <div className="logo">GroceryStore</div>
      <ul className="nav-links">
        <li 
          className={activeTab === 'home' ? 'active' : ''} 
          onClick={() => setActiveTab('home')}
        >
          Home
        </li>
        <li 
          className={activeTab === 'inventory' ? 'active' : ''} 
          onClick={() => setActiveTab('inventory')}
        >
          Inventory List
        </li>
        <li 
          className={activeTab === 'add' ? 'active' : ''} 
          onClick={() => setActiveTab('add')}
        >
          Add Product
        </li>
      </ul>
    </nav>
  );
};

const Home = () => {
  return (
    <div className="home">
      <h1>Welcome to Grocery Inventory Management</h1>
      <p>Use the navigation above to manage your grocery inventory.</p>
    </div>
  );
};

const InventoryForm = ({ formData, isEditing, onInputChange, onSubmit, onReset }) => {
  return (
    <div className="inventory-form">
      <h2>{isEditing ? 'Edit Product' : 'Add New Product'}</h2>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label>Product ID:</label>
          <input 
            type="text" 
            name="productId" 
            value={formData.productId} 
            onChange={onInputChange} 
            disabled={isEditing}
          />
        </div>
        
        <div className="form-group">
          <label>Category:</label>
          <select 
            name="category" 
            value={formData.category} 
            onChange={onInputChange}
          >
            <option value="Fruits">Fruits</option>
            <option value="Vegetables">Vegetables</option>
            <option value="Dairy">Dairy</option>
          </select>
        </div>
        
        <div className="form-group">
          <label>Product Name:</label>
          <input 
            type="text" 
            name="productName" 
            value={formData.productName} 
            onChange={onInputChange} 
          />
        </div>
        
        <div className="form-group">
          <label>Quantity:</label>
          <input 
            type="number" 
            name="quantity" 
            value={formData.quantity} 
            onChange={onInputChange} 
            min="1"
          />
        </div>
        
        <div className="form-group">
          <label>MRP:</label>
          <input 
            type="number" 
            name="mrp" 
            value={formData.mrp} 
            onChange={onInputChange} 
            min="0.01" 
            step="0.01"
          />
        </div>
        
        <div className="form-group">
          <label>Selling Price:</label>
          <input 
            type="number" 
            name="sellingPrice" 
            value={formData.sellingPrice} 
            onChange={onInputChange} 
            min="0.01" 
            step="0.01"
          />
        </div>
        
        <div className="form-actions">
          <button type="submit" className="submit-btn">
            {isEditing ? 'Update' : 'Submit'}
          </button>
          <button type="button" className="reset-btn" onClick={onReset}>
            Reset
          </button>
        </div>
      </form>
    </div>
  );
};

const InventoryList = ({ inventory, onEdit, onDelete }) => {
  return (
    <div className="inventory-list">
      <h2>Inventory List</h2>
      {inventory.length === 0 ? (
        <p>No products in inventory. Add some products to get started.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Category</th>
              <th>Quantity</th>
              <th>Selling Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {inventory.map(item => (
              <tr key={item.productId}>
                <td>{item.productName}</td>
                <td>{item.category}</td>
                <td>{item.quantity}</td>
                <td>₹{parseFloat(item.sellingPrice).toFixed(2)}</td>
                <td>
                  <button 
                    className="edit-btn" 
                    onClick={() => onEdit(item.productId)}
                  >
                    Edit
                  </button>
                  <button 
                    className="delete-btn" 
                    onClick={() => onDelete(item.productId)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default App;