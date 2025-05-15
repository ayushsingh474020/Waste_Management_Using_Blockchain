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
import { BrowserRouter as Router, Routes, Route, useNavigate, Link } from 'react-router-dom';
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
    <div className="auth-container fade-in">
      <div className="form-container">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Waste Management Blockchain</h1>
          <p className="text-gray-600">Revolutionizing waste management with blockchain technology</p>
        </div>
        
        <div className="auth-options">
          <div className="auth-card slide-in-up">
            <h2 className="form-title">New to the Platform?</h2>
            <p className="mb-6">Register with your Ethereum wallet to start using our blockchain-based waste management system.</p>
            <button
              onClick={handleRegister}
              className="btn btn-primary btn-lg btn-block"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16" className="mr-2">
                <path d="M11 5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm-9 8c0 1 1 1 1 1h5.256A4.493 4.493 0 0 1 8 12.5a4.49 4.49 0 0 1 1.544-3.393C9.077 9.038 8.564 9 8 9c-5 0-6 3-6 4Z"/>
                <path d="M12.5 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm.5-5v1h1a.5.5 0 0 1 0 1h-1v1a.5.5 0 0 1-1 0v-1h-1a.5.5 0 0 1 0-1h1v-1a.5.5 0 0 1 1 0Z"/>
              </svg>
              Register with MetaMask
            </button>
          </div>
          
          <div className="auth-card slide-in-up">
            <h2 className="form-title">Already Registered?</h2>
            <p className="mb-6">Login with your Ethereum wallet to access your account and continue your waste management journey.</p>
            <button
              onClick={handleLogin}
              className="btn btn-secondary btn-lg btn-block"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16" className="mr-2">
                <path d="M12.136.326A1.5 1.5 0 0 1 14 1.78V3h.5A1.5 1.5 0 0 1 16 4.5v9a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 13.5v-9a1.5 1.5 0 0 1 1.432-1.499L12.136.326zM5.562 3H13V1.78a.5.5 0 0 0-.621-.484L5.562 3zM1.5 4a.5.5 0 0 0-.5.5v9a.5.5 0 0 0 .5.5h13a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-13z"/>
              </svg>
              Login with MetaMask
            </button>
          </div>
        </div>
        
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>By connecting your wallet, you agree to our Terms of Service and Privacy Policy.</p>
        </div>
      </div>
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
    <div className="app-container">
      <header className="app-header">
        <nav className="navbar">
          <div className="logo">
            <img src="/logo192.png" alt="Logo" />
            <span>Waste Management Blockchain</span>
          </div>
          {isConnected && hasLoggedIn && userRole && (
            <div className="nav-links">
              <Link to="/dashboard" className="nav-link">
                Dashboard
              </Link>
              <Link to="/products" className="nav-link">
                Products
              </Link>
              {userRole === 'admin' && (
                <Link to="/dashboard" className="nav-link">
                  Admin Panel
                </Link>
              )}
            </div>
          )}
          <div className="wallet-info">
            {isConnected && account && (
              <div className={`wallet-button wallet-connected`}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M12.136.326A1.5 1.5 0 0 1 14 1.78V3h.5A1.5 1.5 0 0 1 16 4.5v9a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 13.5v-9a1.5 1.5 0 0 1 1.432-1.499L12.136.326zM5.562 3H13V1.78a.5.5 0 0 0-.621-.484L5.562 3zM1.5 4a.5.5 0 0 0-.5.5v9a.5.5 0 0 0 .5.5h13a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-13z"/>
                </svg>
                <span>{account.slice(0, 6)}...{account.slice(-4)}</span>
              </div>
            )}
          </div>
        </nav>
      </header>

      <main className="main-content">
        <Routes>
          <Route path="/" element={renderAuthButtons()} />
          <Route path="/dashboard" element={renderProtectedPage(renderDashboard())} />
          <Route path="/products" element={renderProtectedPage(<Products />)} />
          <Route path="/products/:productId" element={renderProtectedPage(<Product />)} />
        </Routes>
      </main>

      <footer className="app-footer">
        <div className="footer-content">
          <div className="footer-grid">
            <div className="footer-column">
              <h3>About</h3>
              <ul className="footer-links">
                <li><a href="#">About Us</a></li>
                <li><a href="#">Our Mission</a></li>
                <li><a href="#">Blockchain Technology</a></li>
                <li><a href="#">Sustainability Goals</a></li>
              </ul>
            </div>
            <div className="footer-column">
              <h3>Resources</h3>
              <ul className="footer-links">
                <li><a href="#">Documentation</a></li>
                <li><a href="#">API Reference</a></li>
                <li><a href="#">Smart Contracts</a></li>
                <li><a href="#">White Paper</a></li>
              </ul>
            </div>
            <div className="footer-column">
              <h3>Community</h3>
              <ul className="footer-links">
                <li><a href="#">Forum</a></li>
                <li><a href="#">Discord</a></li>
                <li><a href="#">Twitter</a></li>
                <li><a href="#">GitHub</a></li>
              </ul>
            </div>
            <div className="footer-column">
              <h3>Contact</h3>
              <ul className="footer-links">
                <li><a href="#">Support</a></li>
                <li><a href="#">Partnerships</a></li>
                <li><a href="#">Careers</a></li>
                <li><a href="#">Press</a></li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p>© {new Date().getFullYear()} Waste Management Blockchain. All rights reserved.</p>
            <p>Final Year Project - Blockchain-Based Waste Management System</p>
          </div>
        </div>
      </footer>
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
