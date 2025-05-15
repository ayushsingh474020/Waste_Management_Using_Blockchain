// import React, { useState, useEffect } from 'react';
// import { useWeb3 } from '../contexts/Web3Context';
// import axios from 'axios';

// const WasteCategories = [
//   'ORGANIC',
//   'PLASTIC',
//   'METAL',
//   'ELECTRONIC',
//   'PAPER',
//   'GLASS',
//   'HAZARDOUS',
// ];

// const CitizenDashboard: React.FC = () => {
//   const { account, contract } = useWeb3();
//   const [reports, setReports] = useState<any[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [formData, setFormData] = useState({
//     latitude: '',
//     longitude: '',
//     address: '',
//     wasteType: 0,
//     quantity: 1,
//   });

//   const fetchReports = async () => {
//     try {
//       const response = await axios.get(
//         `${process.env.REACT_APP_BACKEND_URL}/api/waste/user/${account}`
//       );
//       setReports(response.data);
//     } catch (error) {
//       console.error('Error fetching reports:', error);
//     }
//   };

//   useEffect(() => {
//     if (account) {
//       fetchReports();
//     }
//   }, [account]);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       const tx = await contract.reportWaste(
//         formData.latitude,
//         formData.longitude,
//         formData.address,
//         formData.wasteType,
//         formData.quantity
//       );
//       await tx.wait();
      
//       // Save to backend
//       await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/waste`, {
//         blockchainId: tx.hash,
//         reporter: account,
//         location: `${formData.latitude},${formData.longitude}`,
//         wasteType: WasteCategories[formData.wasteType],
//       });

//       fetchReports();
//       setFormData({
//         latitude: '',
//         longitude: '',
//         address: '',
//         wasteType: 0,
//         quantity: 1,
//       });
//     } catch (error) {
//       console.error('Error reporting waste:', error);
//       alert('Error reporting waste. Please try again.');
//     }
//     setLoading(false);
//   };

//   return (
//     <div className="max-w-4xl mx-auto p-4">
//       <h1 className="text-2xl font-bold mb-6">Citizen Dashboard</h1>
      
//       {/* Report Waste Form */}
//       <div className="bg-white rounded-lg shadow p-6 mb-6">
//         <h2 className="text-xl font-semibold mb-4">Report Waste</h2>
//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div className="grid grid-cols-2 gap-4">
//             <input
//               type="text"
//               placeholder="Latitude"
//               value={formData.latitude}
//               onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
//               className="border rounded p-2"
//               required
//             />
//             <input
//               type="text"
//               placeholder="Longitude"
//               value={formData.longitude}
//               onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
//               className="border rounded p-2"
//               required
//             />
//           </div>
//           <input
//             type="text"
//             placeholder="Address"
//             value={formData.address}
//             onChange={(e) => setFormData({ ...formData, address: e.target.value })}
//             className="border rounded p-2 w-full"
//             required
//           />
//           <div className="grid grid-cols-2 gap-4">
//             <select
//               value={formData.wasteType}
//               onChange={(e) => setFormData({ ...formData, wasteType: parseInt(e.target.value) })}
//               className="border rounded p-2"
//             >
//               {WasteCategories.map((type, index) => (
//                 <option key={type} value={index}>
//                   {type}
//                 </option>
//               ))}
//             </select>
//             <input
//               type="number"
//               min="1"
//               placeholder="Quantity (kg)"
//               value={formData.quantity}
//               onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
//               className="border rounded p-2"
//               required
//             />
//           </div>
//           <button
//             type="submit"
//             disabled={loading}
//             className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
//           >
//             {loading ? 'Submitting...' : 'Report Waste'}
//           </button>
//         </form>
//       </div>

//       {/* Reports List */}
//       <div className="bg-white rounded-lg shadow p-6">
//         <h2 className="text-xl font-semibold mb-4">Your Reports</h2>
//         <div className="space-y-4">
//           {reports.map((report) => (
//             <div
//               key={report._id}
//               className="border rounded p-4 hover:bg-gray-50"
//             >
//               <div className="flex justify-between">
//                 <span className="font-medium">{report.wasteType}</span>
//                 <span className={`px-2 py-1 rounded text-sm ${
//                   report.status === 'collected'
//                     ? 'bg-green-100 text-green-800'
//                     : 'bg-yellow-100 text-yellow-800'
//                 }`}>
//                   {report.status}
//                 </span>
//               </div>
//               <p className="text-sm text-gray-600 mt-2">{report.location}</p>
//               <p className="text-sm text-gray-500 mt-1">
//                 Reported: {new Date(report.reportedAt).toLocaleDateString()}
//               </p>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CitizenDashboard;


import React, { useState, useEffect } from 'react';
import { useWeb3 } from '../contexts/Web3Context';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const WasteCategories = [
  'ORGANIC',
  'PLASTIC',
  'METAL',
  'ELECTRONIC',
  'PAPER',
  'GLASS',
  'HAZARDOUS',
];

const CitizenDashboard: React.FC = () => {
  const { account, contract} = useWeb3();
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    latitude: '',
    longitude: '',
    address: '',
    wasteType: 0,
    quantity: 1,
  });
  const [points, setPoints] = useState<number | null>(null); // Add state for points
  


  // Fetch user reports from backend
  const fetchReports = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/waste/user/${account}`
      );
      setReports(response.data);
    } catch (error) {
      console.error('Error fetching reports:', error);
    }
  };

  // Fetch user points from the smart contract
  const fetchUserPoints = async () => {
    try {
      const userPoints = await contract.getUserPoints(account);
      setPoints(userPoints.toNumber()); // Assuming getUserPoints returns a BigNumber
    } catch (error) {
      console.error('Error fetching points:', error);
    }
  };

  useEffect(() => {
    if (account) {
      fetchReports();
      fetchUserPoints(); // Fetch points when account is available
    }
  }, [account]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const tx = await contract.reportWaste(
        formData.latitude,
        formData.longitude,
        formData.address,
        formData.wasteType,
        formData.quantity
      );
      await tx.wait();
      
      // Save to backend
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/waste`, {
        blockchainId: tx.hash,
        reporter: account,
        location: `${formData.latitude},${formData.longitude}`,
        wasteType: WasteCategories[formData.wasteType],
      });

      fetchReports();
      fetchUserPoints(); // Re-fetch points after submitting report
      setFormData({
        latitude: '',
        longitude: '',
        address: '',
        wasteType: 0,
        quantity: 1,
      });
    } catch (error) {
      console.error('Error reporting waste:', error);
      alert('Error reporting waste. Please try again.');
    }
    setLoading(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('connectedAccount');
    window.location.href = '/';
  };

  
  


  return (
    <div className="citizen-dashboard">
      <div className="dashboard-header">
        <h1 className="admin-title">Citizen Dashboard {account}</h1>
        <div className="dashboard-actions">
          <Link to="/products" className="btn btn-secondary">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" className="mr-2">
              <path d="M8 1a2.5 2.5 0 0 1 2.5 2.5V4h-5v-.5A2.5 2.5 0 0 1 8 1zm3.5 3v-.5a3.5 3.5 0 1 0-7 0V4H1v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4h-3.5z"/>
            </svg>
            View Products
          </Link>
          <button
            onClick={handleLogout}
            className="btn btn-outline"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" className="mr-2">
              <path fillRule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0v2z"/>
              <path fillRule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z"/>
            </svg>
            Logout
          </button>
        </div>
      </div>
      
      <div className="stat-grid">
        <div className="stat-card">
          <div className="card-header">
            <h3 className="stat-title">Your Points</h3>
            <div className="card-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
                <path d="M0 5a5.002 5.002 0 0 0 4.027 4.905 6.46 6.46 0 0 1 .544-2.073C3.695 7.536 3.132 6.864 3 5.91h-.5v-.426h.466V5.05c0-.046 0-.093.004-.135H2.5v-.427h.511C3.236 3.24 4.213 2.5 5.681 2.5c.316 0 .59.031.819.085v.733a3.46 3.46 0 0 0-.815-.082c-.919 0-1.538.466-1.734 1.252h1.917v.427h-1.98c-.003.046-.003.097-.003.147v.422h1.983v.427H3.93c.118.602.468 1.03 1.005 1.229a6.5 6.5 0 0 1 4.97-3.113A5.002 5.002 0 0 0 0 5zm16 5.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0zm-7.75 1.322c.069.835.746 1.485 1.964 1.562V14h.54v-.62c1.259-.086 1.996-.74 1.996-1.69 0-.865-.563-1.31-1.57-1.54l-.426-.1V8.374c.54.06.884.347.966.745h.948c-.07-.804-.779-1.433-1.914-1.502V7h-.54v.629c-1.076.103-1.808.732-1.808 1.622 0 .787.544 1.288 1.45 1.493l.358.085v1.78c-.554-.08-.92-.376-1.003-.787H8.25zm1.96-1.895c-.532-.12-.82-.364-.82-.732 0-.41.311-.719.824-.809v1.54h-.005zm.622 1.044c.645.145.943.38.943.796 0 .474-.37.8-1.02.86v-1.674l.077.018z"/>
              </svg>
            </div>
          </div>
          <div className="points-display">{points !== null ? points : '...'}</div>
          <div className="stat-footer">
            <span>Use points to purchase recycled products</span>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="card-header">
            <h3 className="stat-title">Your Reports</h3>
            <div className="card-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
                <path d="M14.5 3a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h13zm-13-1A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-13z"/>
                <path d="M7 5.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5zm-1.496-.854a.5.5 0 0 1 0 .708l-1.5 1.5a.5.5 0 0 1-.708 0l-.5-.5a.5.5 0 1 1 .708-.708l.146.147 1.146-1.147a.5.5 0 0 1 .708 0zM7 9.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5zm-1.496-.854a.5.5 0 0 1 0 .708l-1.5 1.5a.5.5 0 0 1-.708 0l-.5-.5a.5.5 0 0 1 .708-.708l.146.147 1.146-1.147a.5.5 0 0 1 .708 0z"/>
              </svg>
            </div>
          </div>
          <div className="stat-value">{reports.length}</div>
          <div className="stat-footer">
            <span className="stat-trend-up">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path fillRule="evenodd" d="M8 12a.5.5 0 0 0 .5-.5V5.707l2.146 2.147a.5.5 0 0 0 .708-.708l-3-3a.5.5 0 0 0-.708 0l-3 3a.5.5 0 1 0 .708.708L7.5 5.707V11.5a.5.5 0 0 0 .5.5z"/>
              </svg>
              Active contributor
            </span>
          </div>
        </div>
      </div>

      {/* Report Waste Form */}
      <div className="form-container">
        <h2 className="form-title">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16" className="mr-2">
            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
            <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
          </svg>
          Report Waste
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label">Latitude</label>
              <input
                type="text"
                placeholder="Enter latitude coordinates"
                value={formData.latitude}
                onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                className="form-input"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Longitude</label>
              <input
                type="text"
                placeholder="Enter longitude coordinates"
                value={formData.longitude}
                onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                className="form-input"
                required
              />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Address</label>
            <input
              type="text"
              placeholder="Enter the waste location address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="form-input"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label">Waste Type</label>
              <select
                value={formData.wasteType}
                onChange={(e) => setFormData({ ...formData, wasteType: parseInt(e.target.value) })}
                className="form-select"
              >
                {WasteCategories.map((type, index) => (
                  <option key={type} value={index}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Quantity (kg)</label>
              <input
                type="number"
                min="1"
                placeholder="Enter waste quantity"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
                className="form-input"
                required
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Submitting...
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" className="mr-2">
                  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                  <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
                </svg>
                Report Waste
              </>
            )}
          </button>
        </form>
      </div>

      {/* Reports List */}
      <div className="dashboard-card">
        <div className="card-header">
          <h2 className="card-title">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16" className="mr-2">
              <path d="M14.5 3a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h13zm-13-1A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-13z"/>
              <path d="M7 5.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5zm-1.496-.854a.5.5 0 0 1 0 .708l-1.5 1.5a.5.5 0 0 1-.708 0l-.5-.5a.5.5 0 1 1 .708-.708l.146.147 1.146-1.147a.5.5 0 0 1 .708 0zM7 9.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5zm-1.496-.854a.5.5 0 0 1 0 .708l-1.5 1.5a.5.5 0 0 1-.708 0l-.5-.5a.5.5 0 0 1 .708-.708l.146.147 1.146-1.147a.5.5 0 0 1 .708 0z"/>
            </svg>
            Your Reports
          </h2>
        </div>
        <div className="report-list">
          {reports.length === 0 ? (
            <div className="text-center p-6 text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" viewBox="0 0 16 16" className="mx-auto mb-4 opacity-50">
                <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>
                <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
              </svg>
              <p>No reports yet. Start by reporting waste above.</p>
            </div>
          ) : (
            reports.map((report) => (
              <div
                key={report._id}
                className={`report-card ${report.status}`}
              >
                <div className="report-header">
                  <span className="report-type">{report.wasteType}</span>
                  <span className={`status-badge status-${report.status}`}>
                    {report.status}
                  </span>
                </div>
                <div className="report-location">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16" className="mr-1">
                    <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"/>
                  </svg>
                  {report.location}
                </div>
                <div className="report-date">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16" className="mr-1">
                    <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z"/>
                  </svg>
                  {new Date(report.reportedAt).toLocaleDateString()}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default CitizenDashboard;
