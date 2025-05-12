// // import React, { useState, useEffect } from 'react';
// // import { useWeb3 } from '../contexts/Web3Context';
// // import axios from 'axios';

// // const CollectorDashboard: React.FC = () => {
// //   const { account, contract } = useWeb3();
// //   const [reports, setReports] = useState<any[]>([]);
// //   const [loading, setLoading] = useState(false);

// //   const fetchReports = async () => {
// //     try {
// //       const response = await axios.get(
// //         `${process.env.REACT_APP_BACKEND_URL}/api/waste`
// //       );
// //       setReports(response.data.filter((report: any) => report.status !== 'collected'));
// //     } catch (error) {
// //       console.error('Error fetching reports:', error);
// //     }
// //   };

// //   useEffect(() => {
// //     if (account) {
// //       fetchReports();
// //     }
// //   }, [account]);

// //   const handleCollect = async (reportId: number) => {
// //     console.log('handleCollect called with', reportId);
// //     setLoading(true);
// //     try {
// //       console.log('Sending transaction to contract with reportId:', reportId);
// //       const tx = await contract.collectWaste(reportId);
// //       console.log('Transaction sent:', tx);
// //       await tx.wait();
// //       console.log('Transaction confirmed');
// //       await tx.wait();

// //       // Update backend
// //       await axios.patch(
// //         `${process.env.REACT_APP_BACKEND_URL}/api/waste/blockchain/${reportId}`,
// //         {
// //           status: 'collected',
// //           collector: account,
// //         }
// //       );

// //       fetchReports();
// //     } catch (error) {
// //       console.error('Error collecting waste:', error);
// //       alert('Error collecting waste. Please try again.');
// //     }
// //     setLoading(false);
// //   };

// //   return (
// //     <div className="max-w-4xl mx-auto p-4">
// //       <h1 className="text-2xl font-bold mb-6">Collector Dashboard</h1>

// //       <div className="bg-white rounded-lg shadow p-6">
// //         <h2 className="text-xl font-semibold mb-4">Available Collections</h2>
// //         <div className="space-y-4">
// //           {reports.map((report) => (
// //             <div
// //               key={report._id}
// //               className="border rounded p-4 hover:bg-gray-50"
// //             >
// //               <div className="flex justify-between items-center">
// //                 <div>
// //                   <span className="font-medium">{report.wasteType}</span>
// //                   <p className="text-sm text-gray-600 mt-2">{report.location}</p>
// //                   <p className="text-sm text-gray-500">
// //                     Reported: {new Date(report.reportedAt).toLocaleDateString()}
// //                   </p>
// //                 </div>
// //                 <button
// //                   onClick={() => {
// //                     console.log("Button clicked");
// //                     handleCollect(report.blockchainId);
// //                   }}
// //                   disabled={loading}
// //                   className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:bg-gray-400"
// //                 >
// //                   {loading ? 'Processing...' : 'Collect'}
// //                 </button>
// //               </div>
// //             </div>
// //           ))}
// //           {reports.length === 0 && (
// //             <p className="text-gray-500 text-center py-4">
// //               No waste reports available for collection
// //             </p>
// //           )}
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default CollectorDashboard;

// import React, { useState, useEffect } from 'react';
// import { useWeb3 } from '../contexts/Web3Context';
// import axios from 'axios';

// const CollectorDashboard: React.FC = () => {
//   const { account, contract } = useWeb3();
//   const [reports, setReports] = useState<any[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [points, setPoints] = useState<number>(0);  // State to store points

//   const fetchReports = async () => {
//     try {
//       const response = await axios.get(
//         `${process.env.REACT_APP_BACKEND_URL}/api/waste`
//       );
//       setReports(response.data.filter((report: any) => report.status !== 'collected'));
//     } catch (error) {
//       console.error('Error fetching reports:', error);
//     }
//   };

//   // Fetch points from the backend or smart contract
//   const fetchPoints = async () => {
//     try {
//       const response = await axios.get(
//         `${process.env.REACT_APP_BACKEND_URL}/api/collector/points/${account}`
//       );
//       setPoints(response.data.points); // Assume points are returned in the response
//     } catch (error) {
//       console.error('Error fetching points:', error);
//     }
//   };

//   useEffect(() => {
//     if (account) {
//       fetchReports();
//       fetchPoints();  // Fetch points on account change
//     }
//   }, [account]);

  // const handleCollect = async (reportId: number) => {
  //   setLoading(true);
  //   try {
  //     const tx = await contract.collectWaste(reportId);
  //     await tx.wait();

  //     // Update backend
  //     await axios.patch(
  //       `${process.env.REACT_APP_BACKEND_URL}/api/waste/blockchain/${reportId}`,
  //       {
  //         status: 'collected',
  //         collector: account,
  //       }
  //     );

  //     // Fetch updated reports and points
  //     fetchReports();
  //     fetchPoints(); // Fetch updated points after collection
  //   } catch (error) {
  //     console.error('Error collecting waste:', error);
  //     alert('Error collecting waste. Please try again.');
  //   }
  //   setLoading(false);
  // };

//   return (
//     <div className="max-w-4xl mx-auto p-4">
//       <h1 className="text-2xl font-bold mb-6">Collector Dashboard</h1>

//       {/* Points Section */}
//       <div className="bg-white rounded-lg shadow p-6 mb-6">
//         <h2 className="text-xl font-semibold mb-4">Your Points</h2>
//         <p className="text-lg font-medium">{points} Points</p>
//       </div>

//       {/* Available Collections Section */}
//       <div className="bg-white rounded-lg shadow p-6">
//         <h2 className="text-xl font-semibold mb-4">Available Collections</h2>
//         <div className="space-y-4">
//           {reports.map((report) => (
//             <div
//               key={report._id}
//               className="border rounded p-4 hover:bg-gray-50"
//             >
//               <div className="flex justify-between items-center">
//                 <div>
//                   <span className="font-medium">{report.wasteType}</span>
//                   <p className="text-sm text-gray-600 mt-2">{report.location}</p>
//                   <p className="text-sm text-gray-500">
//                     Reported: {new Date(report.reportedAt).toLocaleDateString()}
//                   </p>
//                 </div>
//                 <button
//                   onClick={() => handleCollect(report.blockchainId)}
//                   disabled={loading}
//                   className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:bg-gray-400"
//                 >
//                   {loading ? 'Processing...' : 'Collect'}
//                 </button>
//               </div>
//             </div>
//           ))}
//           {reports.length === 0 && (
//             <p className="text-gray-500 text-center py-4">
//               No waste reports available for collection
//             </p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CollectorDashboard;

import React, { useState, useEffect } from 'react';
import { useWeb3 } from '../contexts/Web3Context';
import axios from 'axios';

const CollectorDashboard: React.FC = () => {
  const { account, contract } = useWeb3();
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [points, setPoints] = useState<number>(0);

  const fetchReports = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/waste`);
      setReports(response.data.filter((report: any) => report.status !== 'collected'));
    } catch (error) {
      console.error('Error fetching reports:', error);
      alert('Unable to fetch reports. Please try again later.');
    }
  };

  const fetchPoints = async () => {
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
      fetchPoints();
    }
  }, [account]);


  const handleCollect = async (reportId: number) => {
    console.log(reportId);
    setLoading(true);
    try {
      const tx = await contract.collectWaste(reportId);
      await tx.wait();
      console.log("print");

      // Update backend
      await axios.patch(
        `${process.env.REACT_APP_BACKEND_URL}/api/waste/blockchain/${reportId}`,
        {
          status: 'collected',
          collector: account,
        }
      );

      console.log("Done");

      // Fetch updated reports and points
      fetchReports();
      fetchPoints(); // Fetch updated points after collection
    } catch (error) {
      console.error('Error collecting waste:', error);
      alert('Error collecting waste. Please try again.');
    }
    setLoading(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('connectedAccount');
    window.location.href = '/';
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Collector Dashboard</h1>
      <button
        onClick={handleLogout}
        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
      >
        Logout
      </button>

      {/* Points Section */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Your Points</h2>
        <p className="text-lg font-medium">{points} Points</p>
      </div>

      {/* Available Collections Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Available Collections</h2>
        <div className="space-y-4">
          {reports.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No waste reports available for collection</p>
          ) : (
            reports.map((report) => (
              <div key={report._id} className="border rounded p-4 hover:bg-gray-50">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="font-medium">{report.wasteType}</span>
                    <p className="text-sm text-gray-600 mt-2">{report.location}</p>
                    <p className="text-sm text-gray-500">
                      Reported: {new Date(report.reportedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={() => handleCollect(report.blockchainId)}
                    disabled={loading}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:bg-gray-400"
                  >
                    {loading ? 'Processing...' : 'Collect'}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default CollectorDashboard;

