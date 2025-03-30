import React, { useState, useEffect } from 'react';
import { Search, Plus } from 'lucide-react';

// Sample initial products data
const initialProducts = [
  { 
    code: 'B-1', 
    name: '4689 Cotton Blouse', 
    category: 'Blouses', 
    costPrice: 45,
    price: 65, 
    qty: 100, 
    sold: 0 
  },
  { 
    code: 'B-2', 
    name: 'Arvind Cotton Blouse', 
    category: 'Blouses', 
    costPrice: 60,
    price: 85, 
    qty: 100, 
    sold: 0 
  },
];

export const Inventory = () => {
  const savedProducts = JSON.parse(localStorage.getItem('products')) || initialProducts;
  const [products, setProducts] = useState(savedProducts);
  const [searchQuery, setSearchQuery] = useState(localStorage.getItem('searchQuery') || '');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({
    code: '',
    name: '',
    category: '',
    costPrice: 0,
    price: 0,
    qty: 0,
    sold: 0,
  });
  const [editedProduct, setEditedProduct] = useState(null);
  const [deletedProduct, setDeletedProduct] = useState(null);
  const [undoTimer, setUndoTimer] = useState(10);

  useEffect(() => {
    localStorage.setItem('products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('searchQuery', searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    if (undoTimer > 0 && deletedProduct) {
      const timer = setTimeout(() => setUndoTimer(undoTimer - 1), 1000);
      return () => clearTimeout(timer);
    } else if (undoTimer === 0) {
      setDeletedProduct(null);
    }
  }, [undoTimer, deletedProduct]);

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = (code) => {
    const productToDelete = products.find((product) => product.code === code);
    setDeletedProduct(productToDelete);

    const updatedProducts = products.filter((product) => product.code !== code);
    setProducts(updatedProducts);

    setUndoTimer(10);
  };

  const handleUndoDelete = () => {
    if (deletedProduct) {
      const updatedProducts = [...products, deletedProduct];
      updatedProducts.sort((a, b) => a.code.localeCompare(b.code));
      setProducts(updatedProducts);
      setDeletedProduct(null);
      setUndoTimer(0);
    }
  };

  const handleAddProduct = () => {
    const newCode = P-${Math.floor(Math.random() * 10000)};
    const updatedProducts = [...products, { ...newProduct, code: newCode }];
    setProducts(updatedProducts);
    setIsModalOpen(false);
    setNewProduct({ 
      code: '', 
      name: '', 
      category: '', 
      costPrice: 0, 
      price: 0, 
      qty: 0, 
      sold: 0 
    });
  };

  const handleEdit = (product) => {
    setEditedProduct(product);
    setIsModalOpen(true);
  };

  const handleSaveEdit = () => {
    const updatedProducts = products.map((product) =>
      product.code === editedProduct.code ? editedProduct : product
    );

    updatedProducts.sort((a, b) => a.code.localeCompare(b.code));
    setProducts(updatedProducts);
    setIsModalOpen(false);
    setEditedProduct(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (editedProduct) {
      setEditedProduct((prev) => ({ ...prev, [name]: value }));
    } else {
      setNewProduct((prev) => ({ ...prev, [name]: value }));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Inventory Management</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
        >
          <Plus className="h-5 w-5" />
          <span>Add Product</span>
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        <input
          type="text"
          placeholder="Search inventory..."
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cost Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Selling Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Margin</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sold</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredProducts.map((product) => {
              const margin = product.price - product.costPrice;
              const marginPercentage = ((margin / product.costPrice) * 100).toFixed(2);
              return (
                <tr key={product.code}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.code}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.category}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₹{product.costPrice}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₹{product.price}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ₹{margin} ({marginPercentage}%)
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.qty}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.sold}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-purple-600 hover:text-purple-900" onClick={() => handleEdit(product)}>
                      Edit
                    </button>
                    <button className="ml-4 text-red-600 hover:text-red-900" onClick={() => handleDelete(product.code)}>
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-md shadow-md w-96">
            <h2 className="text-xl font-bold mb-4">{editedProduct ? 'Edit Product' : 'Add Product'}</h2>
            <form onSubmit={(e) => e.preventDefault()}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Product Name</label>
                <input
                  type="text"
                  name="name"
                  value={editedProduct ? editedProduct.name : newProduct.name}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Category</label>
                <input
                  type="text"
                  name="category"
                  value={editedProduct ? editedProduct.category : newProduct.category}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Cost Price</label>
                <input
                  type="number"
                  name="costPrice"
                  value={editedProduct ? editedProduct.costPrice : newProduct.costPrice}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Selling Price</label>
                <input
                  type="number"
                  name="price"
                  value={editedProduct ? editedProduct.price : newProduct.price}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Stock</label>
                <input
                  type="number"
                  name="qty"
                  value={editedProduct ? editedProduct.qty : newProduct.qty}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Sold</label>
                <input
                  type="number"
                  name="sold"
                  value={editedProduct ? editedProduct.sold : newProduct.sold}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={editedProduct ? handleSaveEdit : handleAddProduct}
                  className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Undo Delete Notification */}
      {deletedProduct && (
        <div className="fixed bottom-4 right-4 bg-gray-800 text-white p-4 rounded-md">
          <p>Product deleted: {deletedProduct.name}</p>
          <p>Time left: {undoTimer}s</p>
          <button
            className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-md"
            onClick={handleUndoDelete}
          >
            Undo
          </button>
        </div>
      )}
    </div>
  );
};
