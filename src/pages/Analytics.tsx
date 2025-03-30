import React, { useEffect, useState } from 'react';
import { TrendingUp, Package, AlertTriangle, DollarSign } from 'lucide-react';

export const Analytics = () => {
  const [totalSold, setTotalSold] = useState(0);
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    // Fetch products from localStorage
    const savedProducts = JSON.parse(localStorage.getItem('products') || '[]');
    setProducts(savedProducts);

    // Fetch total product sale count from localStorage
    const currentTotalSaleCount = parseInt(localStorage.getItem('totalProductSaleCount') || '0', 10);
    setTotalSold(currentTotalSaleCount); // Display total product sale count
  }, []);

  // Calculate total stock value
  const totalValue = products.reduce((acc, product) => acc + product.price * product.qty, 0);

  // Calculate low stock items (qty <= 3)
  const lowStock = products.filter(product => product.qty <= 3).length;

  // Calculate top selling products (sold > 0)
  const topSellingProducts = products
    .filter(product => product.sold > 0)
    .sort((a, b) => b.sold - a.sold)
    .slice(0, 5);

  const stats = [
    { label: 'Total Products', value: products.length, icon: Package, color: 'bg-blue-500' },
    { label: 'Stock Value', value: `₹${totalValue.toLocaleString()}`, icon: DollarSign, color: 'bg-green-500' },
    { label: 'Low Stock Items', value: lowStock, icon: AlertTriangle, color: 'bg-yellow-500' },
    { label: 'Total Products Sold Today', value: totalSold, icon: TrendingUp, color: 'bg-purple-500' },
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-gray-800">Analytics Dashboard</h1>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-lg shadow-md p-6">
            <div className={`${color} w-12 h-12 rounded-full flex items-center justify-center mb-4`}>
              <Icon className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-gray-600 text-sm">{label}</h3>
            <p className="text-2xl font-bold text-gray-800">{value}</p>
          </div>
        ))}
      </div>

      {/* Side-by-Side Layout for Low Stock and Top Selling Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Selling Products Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Top Selling Products</h2>
          <div className="space-y-4">
            {topSellingProducts.length > 0 ? (
              topSellingProducts.map((product) => (
                <div key={product.code} className="flex justify-between items-center">
                  <div>
                    <div className="font-medium text-gray-800">{product.name}</div>
                    <div className="text-sm text-gray-500">{product.code}</div>
                  </div>
                  <div className="text-lg font-semibold text-purple-600">{product.sold} sold</div>
                </div>
              ))
            ) : (
              <p>No products sold yet</p>
            )}
          </div>
        </div>

        {/* Low Stock Alert Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Low Stock Alert</h2>
          <div className="space-y-4">
            {products
              .filter((product) => product.qty <= 3)
              .map((product) => (
                <div key={product.code} className="flex justify-between items-center">
                  <div>
                    <div className="font-medium text-gray-800">{product.name}</div>
                    <div className="text-sm text-gray-500">{product.code}</div>
                  </div>
                  <div className={`text-sm font-semibold ${product.qty === 0 ? 'text-red-600' : 'text-yellow-600'}`}>
                    {product.qty === 0 ? 'Out of stock' : `${product.qty} remaining`}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};
