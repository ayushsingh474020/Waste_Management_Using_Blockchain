// import React, { createContext, useContext, useState, useEffect } from 'react';
// import { ethers } from 'ethers';
// import WasteManagementABI from '../contracts/WasteManagement.json';

// declare global {
//   interface Window {
//     ethereum?: any;
//   }
// }


// interface Web3ContextType {
//   account: string | null;
//   contract: any;
//   provider: any;
//   connectWallet: () => Promise<void>;
//   isConnected: boolean;
// }

// const Web3Context = createContext<Web3ContextType | null>(null);

// export const Web3Provider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const [account, setAccount] = useState<string | null>(null);
//   const [contract, setContract] = useState<any>(null);
//   const [provider, setProvider] = useState<any>(null);

//   const connectWallet = async () => {
//     try {
//       if (window.ethereum) {
//         const accounts = await window.ethereum.request({
//           method: 'eth_requestAccounts',
//         });
//         const provider = new ethers.providers.Web3Provider(window.ethereum);
//         const signer = provider.getSigner();
//         const contract = new ethers.Contract(
//           process.env.REACT_APP_CONTRACT_ADDRESS!,
//           WasteManagementABI.abi,
//           signer
//         );

//         setAccount(accounts[0]);
//         setContract(contract);
//         setProvider(provider);
//       } else {
//         alert('Please install MetaMask!');
//       }
//     } catch (error) {
//       console.error('Error connecting wallet:', error);
//     }
//   };

//   useEffect(() => {
//     if (window.ethereum) {
//       window.ethereum.on('accountsChanged', (accounts: string[]) => {
//         setAccount(accounts[0] || null);
//       });
//     }
//   }, []);

//   return (
//     <Web3Context.Provider
//       value={{
//         account,
//         contract,
//         provider,
//         connectWallet,
//         isConnected: !!account,
//       }}
//     >
//       {children}
//     </Web3Context.Provider>
//   );
// };

// export const useWeb3 = () => {
//   const context = useContext(Web3Context);
//   if (!context) {
//     throw new Error('useWeb3 must be used within a Web3Provider');
//   }
//   return context;
// };

import React, { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';
import WasteManagementABI from '../contracts/WasteManagement.json';

declare global {
  interface Window {
    ethereum?: any;
  }
}

interface Web3ContextType {
  account: string | null;
  contract: any;
  provider: any;
  connectWallet: () => Promise<void>;
  isConnected: boolean;
  redeemProduct: (productId: number) => Promise<void>;
}


const Web3Context = createContext<Web3ContextType | null>(null);

export const Web3Provider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [account, setAccount] = useState<string | null>(null);
  const [contract, setContract] = useState<any>(null);
  const [provider, setProvider] = useState<any>(null);

  const connectWallet = async () => {
    try {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts',
        });
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(
          process.env.REACT_APP_CONTRACT_ADDRESS!,
          WasteManagementABI.abi,
          signer
        );

        setAccount(accounts[0]);
        setContract(contract);
        setProvider(provider);
      } else {
        alert('Please install MetaMask!');
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
    }
  };

  const convertPointsToETH = async () => {
    if (!contract || !account) {
      throw new Error('Wallet not connected or contract not loaded');
    }
  
    try {
      const tx = await contract.convertPointsToETH(); // No args
      await tx.wait();
      console.log('Points converted to ETH successfully');
    } catch (error) {
      console.error('Error converting points to ETH:', error);
      throw error;
    }
  };
  

  const redeemProduct = async (amount: number) => {
    // if (!contract || !account) {
    //   throw new Error('Wallet not connected or contract not loaded');
    // }

    try {
      const tx = await contract.redeemProduct(amount);
      await tx.wait();
      console.log('Product redeemed successfully');
    } catch (error) {
      console.error('Error redeeming product:', error);
      throw error;
    }
  };

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        setAccount(accounts[0] || null);
      });
    }
  }, []);

  return (
    <Web3Context.Provider
      value={{
        account,
        contract,
        provider,
        connectWallet,
        isConnected: !!account,
        redeemProduct,
      }}
    >
      {children}
    </Web3Context.Provider>

  );
};

export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
};
