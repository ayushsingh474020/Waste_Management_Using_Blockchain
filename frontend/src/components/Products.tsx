import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Product {
  _id: string;
  name: string;
  description: string;
  image: string; // updated to match schema
  pointsRequired: number;
}

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/api/products`)
      .then((res) => {
        console.log("data : ", res.data);
        setProducts(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching products:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Products</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <a key={product._id} href={`/products/${product._id}`}>
            <div className="border rounded-lg shadow-md p-4 cursor-pointer hover:shadow-lg transition">
              <img
                src={product.image} // updated field
                alt={product.name}
                className="w-full h-48 object-cover rounded"
              />
              <h2 className="text-xl font-semibold mt-2">{product.name}</h2>
              <p className="text-gray-600">Points Required: {product.pointsRequired}</p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default Products;
