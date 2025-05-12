// import React, { useEffect, useState } from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import { useWeb3 } from './contexts/Web3Context';
// import axios from 'axios';

// import CitizenDashboard from './components/CitizenDashboard';
// import CollectorDashboard from './components/CollectorDashboard';
// import AdminDashboard from './components/AdminDashboard';
// import Product from './components/Product';
// import Products from './components/Products';

// const App: React.FC = () => {
//   const { account, connectWallet, isConnected } = useWeb3();
//   const [userRole, setUserRole] = useState<string | null>(null);
//   const [hasLoggedIn, setHasLoggedIn] = useState(false);
//   const [mode, setMode] = useState<'register' | 'login' | null>(null);

//   const fetchUserRole = async (walletAddress: string) => {
//     try {
//       const response = await axios.get(
//         `${process.env.REACT_APP_BACKEND_URL}/api/users/${walletAddress}`
//       );
//       setUserRole(response.data.role);
//       setHasLoggedIn(true);
//     } catch (error) {
//       if (mode === 'register') {
//         const role = window.prompt('Choose role: citizen or collector');
//         if (role !== 'citizen' && role !== 'collector') {
//           alert('Invalid role');
//           return;
//         }
//         try {
//           await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/users`, {
//             address: walletAddress,
//             role,
//           });
//           setUserRole(role);
//           setHasLoggedIn(true);
//         } catch (err) {
//           console.error('Error creating user:', err);
//           alert('Failed to register.');
//         }
//       } else if (mode === 'login') {
//         alert('User not found. Please register first.');
//       }
//     }
//   };

//   useEffect(() => {
//     if (account && mode) {
//       fetchUserRole(account.toLowerCase());
//     }
//   }, [account, mode]);

//   const handleRegister = async () => {
//     await connectWallet();
//     setMode('register');
//   };

//   const handleLogin = async () => {
//     await connectWallet();
//     setMode('login');
//   };

//   const renderAuthButtons = () => (
//     <div className="text-center flex flex-col items-center gap-4">
//       <button
//         onClick={handleRegister}
//         className="bg-purple-500 text-white px-6 py-3 rounded-lg hover:bg-purple-600"
//       >
//         Register with MetaMask
//       </button>
//       <button
//         onClick={handleLogin}
//         className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600"
//       >
//         Login with MetaMask
//       </button>
//     </div>
//   );

//   const renderProtectedPage = (component: React.ReactNode) => {
//     if (!isConnected || !hasLoggedIn) return renderAuthButtons();
//     if (!userRole) return <div>Loading...</div>;
//     return component;
//   };

//   const renderDashboard = () => {
//     switch (userRole) {
//       case 'admin':
//         return <AdminDashboard />;
//       case 'collector':
//         return <CollectorDashboard />;
//       default:
//         return <CitizenDashboard />;
//     }
//   };

//   return (
//     <Router>
//       <div className="min-h-screen bg-gray-100">
//         <nav className="bg-white shadow-sm">
//           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//             <div className="flex justify-between h-16 items-center">
//               <div className="flex-shrink-0">
//                 <h1 className="text-xl font-bold">Waste Management System</h1>
//               </div>
//               <div className="flex items-center">
//                 {isConnected && account && (
//                   <div className="text-sm text-gray-500">
//                     Connected: {account.slice(0, 6)}...{account.slice(-4)}
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         </nav>

//         <main className="py-8">
//           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//             <Routes>
//               <Route path="/" element={renderProtectedPage(renderDashboard())} />
//               <Route path="/products" element={renderProtectedPage(<Products />)} />
//               <Route path="/products/:productId" element={renderProtectedPage(<Product />)} />
//             </Routes>
//           </div>
//         </main>
//       </div>
//     </Router>
//   );
// };

// export default App;

import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { useWeb3 } from './contexts/Web3Context';
import axios from 'axios';

import CitizenDashboard from './components/CitizenDashboard';
import CollectorDashboard from './components/CollectorDashboard';
import AdminDashboard from './components/AdminDashboard';
import Product from './components/Product';
import Products from './components/Products';

const AppContent: React.FC = () => {
  const { account, connectWallet, isConnected } = useWeb3();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [hasLoggedIn, setHasLoggedIn] = useState(false);
  const [mode, setMode] = useState<'register' | 'login' | null>(null);
  const navigate = useNavigate();

  const fetchUserRole = async (walletAddress: string) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/users/${walletAddress}`
      );
      setUserRole(response.data.role);
      setHasLoggedIn(true);
    } catch (error) {
      if (mode === 'register') {
        const role = window.prompt('Choose role: citizen or collector');
        if (role !== 'citizen' && role !== 'collector') {
          alert('Invalid role');
          return;
        }
        try {
          await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/users`, {
            address: walletAddress,
            role,
          });
          setUserRole(role);
          setHasLoggedIn(true);
        } catch (err) {
          console.error('Error creating user:', err);
          alert('Failed to register.');
        }
      } else if (mode === 'login') {
        alert('User not found. Please register first.');
      }
    }
  };

  // Fetch user role after login/register
  useEffect(() => {
    if (account && mode) {
      fetchUserRole(account.toLowerCase());
    }
  }, [account, mode]);

  // Redirect to dashboard after successful login/register
  // useEffect(() => {
  //   if (isConnected && hasLoggedIn && userRole && account) {
  //     localStorage.setItem('connectedAccount', account);
  //     navigate('/dashboard');
  //   }
  // }, [isConnected, hasLoggedIn, userRole, account, navigate]);

  useEffect(() => {
    if (isConnected && hasLoggedIn && userRole && account) {
      localStorage.setItem('connectedAccount', account);
  
      // Get the current path the user is trying to visit
      const currentPath = window.location.pathname;
  
      // Check if the path includes dynamic parameters (like /products/:productId)
      if (currentPath.includes('/products')) {
        navigate(currentPath); // Directly navigate to the product page
      } else {
        navigate('/dashboard'); // Redirect to dashboard if no specific path
      }
    }
  }, [isConnected, hasLoggedIn, userRole, account, navigate]);
  

  // Auto-login if account is stored in localStorage
  useEffect(() => {
    const storedAccount = localStorage.getItem('connectedAccount');
    if (storedAccount) {
      connectWallet();
      setMode('login');
    }
  }, []);

  const handleRegister = async () => {
    await connectWallet();
    setMode('register');
  };

  const handleLogin = async () => {
    await connectWallet();
    setMode('login');
  };

  

  const renderAuthButtons = () => (
    <div className="text-center flex flex-col items-center gap-4">
      <button
        onClick={handleRegister}
        className="bg-purple-500 text-white px-6 py-3 rounded-lg hover:bg-purple-600"
      >
        Register with MetaMask
      </button>
      <button
        onClick={handleLogin}
        className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600"
      >
        Login with MetaMask
      </button>
    </div>
  );

  const renderProtectedPage = (component: React.ReactNode) => {
    if (!isConnected || !hasLoggedIn) return renderAuthButtons();
    if (!userRole) return <div>Loading...</div>;
    return component;
  };

  const renderDashboard = () => {
    switch (userRole) {
      case 'admin':
        return <AdminDashboard />;
      case 'collector':
        return <CollectorDashboard />;
      default:
        return <CitizenDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex-shrink-0">
              <h1 className="text-xl font-bold">Waste Management System</h1>
            </div>
            <div className="flex items-center gap-4">
              {isConnected && account && (
                <>
                  <div className="text-sm text-gray-500">
                    Connected: {account.slice(0, 6)}...{account.slice(-4)}
                  </div>
                  
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Routes>
            <Route path="/" element={renderAuthButtons()} />
            <Route path="/dashboard" element={renderProtectedPage(renderDashboard())} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:productId" element={<Product />} />
          </Routes>
        </div>
      </main>
    </div>
  );
};

// Wrap AppContent with Router
const App: React.FC = () => (
  <Router>
    <AppContent />
  </Router>
);

export default App;
