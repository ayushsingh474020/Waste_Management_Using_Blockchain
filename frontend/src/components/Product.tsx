import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useWeb3 } from '../contexts/Web3Context';
import axios from 'axios';


interface Product {
  _id: string;
  name: string;
  description: string;
  image: string;
  pointsRequired: number;
}

const Product: React.FC = () => {
  const { redeemProduct } = useWeb3();
  const { productId } = useParams();
  const { account, contract } = useWeb3();

  const [product, setProduct] = useState<Product | null>(null);
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [loading, setLoading] = useState(false);

  // ✅ Form fields state
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [pincode, setPincode] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');

  const fetchProduct = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/products/${productId}`);
      setProduct(response.data);
    } catch (error) {
      console.error('Error fetching product:', error);
    }
  };

  useEffect(() => {
    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  useEffect(() => {
    console.log("Product.tsx: account", account);
    console.log("Product.tsx: contract", contract);
  }, [account, contract]);

  const handleRedeem = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!name || !address || !pincode || !mobile || !email) {
      alert('Please fill in all required fields.');
      return;
    }
  
    setLoading(true);
    setIsRedeeming(true);
  
    try {
      if (productId) {
        console.log("inside if");
        console.log(account);
        // console.log()
        // 🔁 Send user info to backend (optional but recommended)
        await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/orders`, {
          name,
          address,
          pincode,
          mobile,
          email,
          productId: productId, // ✅ match the backend schema
          walletAddress:account
        });
        
        console.log("Done");
        // ✅ Call redeemProduct from context
        await redeemProduct(Number(product?.pointsRequired));
        alert('Product redeemed successfully!');
      }
    } catch (error) {
      console.error('Error redeeming product:', error);
      alert('Error redeeming product. Please try again.');
    } finally {
      setLoading(false);
      setIsRedeeming(false);
    }
  };
  

  if (!product) return <p className="p-6">Loading...</p>;

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">{product.name}</h1>

      {/* Product Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <img src={product.image} alt={product.name} className="w-full h-80 object-cover rounded" />
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-gray-500">{product.description}</p>
          <p className="mt-4 text-lg font-semibold">Points Required: {product.pointsRequired}</p>
        </div>
      </div>

      {/* ✅ Redeem Form */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <form onSubmit={handleRedeem} className="space-y-4">
          <div>
            <label className="block font-medium">Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} className="w-full border p-2 rounded" required />
          </div>
          <div>
            <label className="block font-medium">Address</label>
            <textarea value={address} onChange={(e) => setAddress(e.target.value)} className="w-full border p-2 rounded" required />
          </div>
          <div>
            <label className="block font-medium">Pincode</label>
            <input value={pincode} onChange={(e) => setPincode(e.target.value)} className="w-full border p-2 rounded" required />
          </div>
          <div>
            <label className="block font-medium">Mobile</label>
            <input value={mobile} onChange={(e) => setMobile(e.target.value)} className="w-full border p-2 rounded" required />
          </div>
          <div>
            <label className="block font-medium">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border p-2 rounded" required />
          </div>

          <button
            type="submit"
            disabled={isRedeeming || loading}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
          >
            {loading ? 'Processing...' : isRedeeming ? 'Redeeming...' : 'Redeem Now'}
          </button>
        </form>
      </div>

      {/* Optional Loading UI */}
      {loading && (
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <p className="text-gray-500">Please wait while we process your request...</p>
        </div>
      )}
    </div>
  );
};

export default Product;
