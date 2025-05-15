import React, { useState, useEffect } from 'react';
import { useWeb3 } from '../contexts/Web3Context';
import axios from 'axios';
import { Tab } from '@headlessui/react';

interface Stats {
  users: {
    total: number;
    citizens: number;
    collectors: number;
    admins: number;
  };
  reports: {
    total: number;
    pending: number;
    collected: number;
    verified: number;
  };
  orders: {
    total: number;
    completed: number;
    pending: number;
  };
}

interface User {
  address: string;
  role: string;
  createdAt: string;
}

interface WasteReport {
  _id: string;
  reporter: {
    address: string;
    role: string;
  };
  wasteType: string;
  status: string;
  location: string;
  reportedAt: string;
}

const AdminDashboard: React.FC = () => {
  const { account, contract } = useWeb3();
  const [stats, setStats] = useState<Stats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [reports, setReports] = useState<WasteReport[]>([]);
  const [loading, setLoading] = useState(false);
  const [newCollectorAddress, setNewCollectorAddress] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedTab, setSelectedTab] = useState(0);

  const fetchStats = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/admin/stats`, {
        headers: { 'x-user-address': account }
      });
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchData = async () => {
    try {
      const roleFilter = selectedRole === 'all' ? '' : `&role=${selectedRole}`;
      const [usersResponse, reportsResponse] = await Promise.all([
        axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/admin/users?page=${currentPage}${roleFilter}`, {
          headers: { 'x-user-address': account }
        }),
        axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/admin/reports?page=${currentPage}`, {
          headers: { 'x-user-address': account }
        })
      ]);
      setUsers(usersResponse.data.users);
      setReports(reportsResponse.data.reports);
      setTotalPages(Math.max(usersResponse.data.pagination.pages, reportsResponse.data.pagination.pages));
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    if (account) {
      fetchStats();
      fetchData();
    }
  }, [account, currentPage, selectedRole]);

  const handleAddCollector = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await contract.grantCollectorRole(newCollectorAddress);
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/users`, {
        address: newCollectorAddress,
        role: 'collector',
      });
      setNewCollectorAddress('');
      fetchData();
    } catch (error) {
      console.error('Error adding collector:', error);
      alert('Error adding collector. Please try again.');
    }
    setLoading(false);
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      await axios.patch(
        `${process.env.REACT_APP_BACKEND_URL}/api/admin/users/${userId}/role`,
        { role: newRole },
        { headers: { 'x-user-address': account } }
      );
      fetchData();
    } catch (error) {
      console.error('Error updating user role:', error);
      alert('Error updating user role');
    }
  };

  if (!stats) return <div className="spinner"></div>;

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1 className="admin-title">Admin Dashboard</h1>
        <div className="admin-actions">
          <button className="btn btn-outline">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M5 1a2 2 0 0 0-2 2v1h10V3a2 2 0 0 0-2-2H5zm6 8H5a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-3a1 1 0 0 0-1-1z"/>
              <path d="M0 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2h-1v-2a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v2H2a2 2 0 0 1-2-2V7zm2.5 1a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1z"/>
            </svg>
            Export Data
          </button>
          <button className="btn btn-primary">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
            </svg>
            Add New Collector
          </button>
        </div>
      </div>

      <Tab.Group selectedIndex={selectedTab} onChange={setSelectedTab}>
        <div className="admin-tabs">
          <Tab.List className="flex">
            <Tab className={({ selected }) =>
              `admin-tab ${selected ? 'active' : ''}`
            }>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" className="mr-2">
                <path d="M4 5a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H4zm0 1h8a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1z"/>
                <path d="M6 9.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5zM6.5 8a.5.5 0 0 0 0 1h3a.5.5 0 0 0 0-1h-3z"/>
              </svg>
              Overview
            </Tab>
            <Tab className={({ selected }) =>
              `admin-tab ${selected ? 'active' : ''}`
            }>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" className="mr-2">
                <path d="M15 14s1 0 1-1-1-4-5-4-5 3-5 4 1 1 1 1h8zm-7.978-1A.261.261 0 0 1 7 12.996c.001-.264.167-1.03.76-1.72C8.312 10.629 9.282 10 11 10c1.717 0 2.687.63 3.24 1.276.593.69.758 1.457.76 1.72l-.008.002a.274.274 0 0 1-.014.002H7.022zM11 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm3-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0zM6.936 9.28a5.88 5.88 0 0 0-1.23-.247A7.35 7.35 0 0 0 5 9c-4 0-5 3-5 4 0 .667.333 1 1 1h4.216A2.238 2.238 0 0 1 5 13c0-1.01.377-2.042 1.09-2.904.243-.294.526-.569.846-.816zM4.92 10A5.493 5.493 0 0 0 4 13H1c0-.26.164-1.03.76-1.724.545-.636 1.492-1.256 3.16-1.275zM1.5 5.5a3 3 0 1 1 6 0 3 3 0 0 1-6 0zm3-2a2 2 0 1 0 0 4 2 2 0 0 0 0-4z"/>
              </svg>
              Users
            </Tab>
            <Tab className={({ selected }) =>
              `admin-tab ${selected ? 'active' : ''}`
            }>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" className="mr-2">
                <path d="M14.5 3a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h13zm-13-1A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-13z"/>
                <path d="M7 5.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5zm-1.496-.854a.5.5 0 0 1 0 .708l-1.5 1.5a.5.5 0 0 1-.708 0l-.5-.5a.5.5 0 1 1 .708-.708l.146.147 1.146-1.147a.5.5 0 0 1 .708 0zM7 9.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5zm-1.496-.854a.5.5 0 0 1 0 .708l-1.5 1.5a.5.5 0 0 1-.708 0l-.5-.5a.5.5 0 0 1 .708-.708l.146.147 1.146-1.147a.5.5 0 0 1 .708 0z"/>
              </svg>
              Reports
            </Tab>
          </Tab.List>
        </div>

        <Tab.Panels>
          <Tab.Panel>
            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white rounded-lg shadow p-4">
                <h3 className="text-gray-500">Total Users</h3>
                <p className="text-2xl font-bold">{stats.users.total}</p>
                <div className="text-sm text-gray-500 mt-2">
                  <p>Citizens: {stats.users.citizens}</p>
                  <p>Collectors: {stats.users.collectors}</p>
                  <p>Admins: {stats.users.admins}</p>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-4">
                <h3 className="text-gray-500">Waste Reports</h3>
                <p className="text-2xl font-bold">{stats.reports.total}</p>
                <div className="text-sm text-gray-500 mt-2">
                  <p>Pending: {stats.reports.pending}</p>
                  <p>Collected: {stats.reports.collected}</p>
                  <p>Verified: {stats.reports.verified}</p>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-4">
                <h3 className="text-gray-500">Orders</h3>
                <p className="text-2xl font-bold">{stats.orders.total}</p>
                <div className="text-sm text-gray-500 mt-2">
                  <p>Completed: {stats.orders.completed}</p>
                  <p>Pending: {stats.orders.pending}</p>
                </div>
              </div>
            </div>

            {/* Add Collector Form */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Add Collector</h2>
              <form onSubmit={handleAddCollector} className="flex gap-4">
                <input
                  type="text"
                  placeholder="Collector Address"
                  value={newCollectorAddress}
                  onChange={(e) => setNewCollectorAddress(e.target.value)}
                  className="border rounded p-2 flex-grow"
                  required
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
                >
                  {loading ? 'Adding...' : 'Add Collector'}
                </button>
              </form>
            </div>
          </Tab.Panel>

          <Tab.Panel>
            {/* Users Management */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">User Management</h2>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="border rounded p-2"
                >
                  <option value="all">All Roles</option>
                  <option value="citizen">Citizens</option>
                  <option value="collector">Collectors</option>
                  <option value="admin">Admins</option>
                </select>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Address</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Joined</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((user) => (
                      <tr key={user.address}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">{user.address}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">{user.role}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <select
                            value={user.role}
                            onChange={(e) => handleRoleChange(user.address, e.target.value)}
                            className="border rounded p-1"
                          >
                            <option value="citizen">Citizen</option>
                            <option value="collector">Collector</option>
                            <option value="admin">Admin</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </Tab.Panel>

          <Tab.Panel>

            {/* Reports Management */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Waste Reports</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Reporter
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Location
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {reports.map((report) => (
                      <tr key={report._id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {report._id.slice(0, 8)}...
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <div>
                            <p>{report.reporter.address.slice(0, 8)}...</p>
                            <p className="text-xs text-gray-500">{report.reporter.role}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {report.wasteType}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {report.location}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs rounded ${
                            report.status === 'collected'
                              ? 'bg-green-100 text-green-800'
                              : report.status === 'verified'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {report.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {new Date(report.reportedAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path fillRule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/>
            </svg>
          </button>
          
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            // Show pages around current page
            let pageNum: number;
            if (totalPages <= 5) {
              pageNum = i + 1;
            } else if (currentPage <= 3) {
              pageNum = i + 1;
            } else if (currentPage >= totalPages - 2) {
              pageNum = totalPages - 4 + i;
            } else {
              pageNum = currentPage - 2 + i;
            }
            
            return (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className={`page-item ${currentPage === pageNum ? 'active' : ''}`}
              >
                {pageNum}
              </button>
            );
          })}
          
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/>
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;