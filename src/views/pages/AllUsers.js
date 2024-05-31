import React, { useEffect, useState } from 'react';
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CContainer,
  CFormInput,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CSpinner,
  CAlert,
  CModal,
  CModalHeader,
  CModalBody,
  CModalFooter,
} from '@coreui/react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {logout} from "./../../utils/Logout"

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'User ID', direction: 'ascending' });
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    const accessToken = localStorage.getItem('AccessToken');
    try {
      const response = await axios.post(
        'https://api.livingimage.io/api/admin/get-all-user/',
        null,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setUsers(response.data['Users Data']);
    } catch (error) {
      console.error('Error fetching users:', error);
      setErrorMsg(error?.response?.data?.errors?.detail || 'Failed to fetch users');
      if (error?.response?.status === 401) {
        logout()
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const confirmDelete = (user) => {
    setSelectedUser(user);
    setDeleteModal(true);
  };

  const handleDelete = async () => {
    const accessToken = localStorage.getItem('AccessToken');
    setLoading(true);
    try {
      await axios.post(
        'https://api.livingimage.io/api/admin/delete-user/',
        { email: selectedUser['User Email'] },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );
      setUsers(users.filter(user => user['User ID'] !== selectedUser['User ID']));
      setSuccessMsg('User deleted successfully');
    } catch (error) {
      console.error('Error deleting user:', error);
      setErrorMsg(error?.response?.data?.errors?.detail || 'Failed to delete user');
      if (error?.response?.status === 401) {
        logout()
      }
    } finally {
      setLoading(false);
      setDeleteModal(false);
    }
  };

  const handleView = (userId) => {
    navigate(`/user/${userId}`);
  };

  const sortedUsers = [...users].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? 1 : -1;
    }
    return 0;
  });

  const filteredUsers = sortedUsers.filter((user) => {
    return (
      user['User Email'].toLowerCase().includes(searchTerm.toLowerCase()) ||
      user['Name'].toLowerCase().includes(searchTerm.toLowerCase()) ||
      user['User ID'].toString().includes(searchTerm.toLowerCase()) ||
      user['Total Credits'].toString().includes(searchTerm.toLowerCase()) ||
      user['Registered on'].toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user['Verification Status'] ? 'Verified' : 'Not Verified')
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
  });

  return (
    <CContainer>
      <CRow>
        <CCol>
          <CCard>
            <CCardHeader>
              <strong>User List</strong>
            </CCardHeader>
            <CCardBody>
              <CRow className="mb-3">
                <CCol md="6">
                  <CFormInput
                    type="text"
                    placeholder="Search by any field"
                    value={searchTerm}
                    onChange={handleSearch}
                  />
                </CCol>
              </CRow>
              {errorMsg && <CAlert color="danger">{errorMsg}</CAlert>}
              {successMsg && <CAlert color="success">{successMsg}</CAlert>}
              {loading ? (
                <div className="text-center">
                  <CSpinner color="primary" />
                </div>
              ) : (
                <CTable hover>
                  <CTableHead>
                    <CTableRow>
                      <CTableHeaderCell onClick={() => handleSort('User ID')}>
                        User ID {sortConfig.key === 'User ID' && (sortConfig.direction === 'ascending' ? '▲' : '▼')}
                      </CTableHeaderCell>
                      <CTableHeaderCell onClick={() => handleSort('User Email')}>
                        Email {sortConfig.key === 'User Email' && (sortConfig.direction === 'ascending' ? '▲' : '▼')}
                      </CTableHeaderCell>
                      <CTableHeaderCell onClick={() => handleSort('Name')}>
                        Name {sortConfig.key === 'Name' && (sortConfig.direction === 'ascending' ? '▲' : '▼')}
                      </CTableHeaderCell>
                      <CTableHeaderCell onClick={() => handleSort('Total Credits')}>
                        Credits {sortConfig.key === 'Total Credits' && (sortConfig.direction === 'ascending' ? '▲' : '▼')}
                      </CTableHeaderCell>
                      <CTableHeaderCell onClick={() => handleSort('Registered on')}>
                        Registered on {sortConfig.key === 'Registered on' && (sortConfig.direction === 'ascending' ? '▲' : '▼')}
                      </CTableHeaderCell>
                      <CTableHeaderCell onClick={() => handleSort('Verification Status')}>
                        Status {sortConfig.key === 'Verification Status' && (sortConfig.direction === 'ascending' ? '▲' : '▼')}
                      </CTableHeaderCell>
                      <CTableHeaderCell>Actions</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {filteredUsers.map((user) => (
                      <CTableRow key={user['User ID']}>
                        <CTableDataCell>#{user['User ID']}</CTableDataCell>
                        <CTableDataCell>{user['User Email']}</CTableDataCell>
                        <CTableDataCell>{user['Name']}</CTableDataCell>
                        <CTableDataCell>{user['Total Credits']}</CTableDataCell>
                        <CTableDataCell>{user['Registered on']}</CTableDataCell>
                        <CTableDataCell>{user['Verification Status'] ? 'Verified' : 'Not Verified'}</CTableDataCell>
                        <CTableDataCell>
                        <CButton style={{marginRight:"10px"}} color="info" size="sm" onClick={() => handleView(user['User Email'])}>
                            View
                          </CButton>
                          <CButton color="danger" size="sm" onClick={() => confirmDelete(user)}>
                            Delete
                          </CButton>{' '}
                          
                        </CTableDataCell>
                      </CTableRow>
                    ))}
                  </CTableBody>
                </CTable>
              )}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
      <CModal visible={deleteModal} onClose={() => setDeleteModal(false)}>
        <CModalHeader closeButton>Confirm Delete</CModalHeader>
        <CModalBody>
          Are you sure you want to delete the user <strong>{selectedUser?.['User Email']}</strong>?
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setDeleteModal(false)}>
            Cancel
          </CButton>
          <CButton color="danger" onClick={handleDelete}>
            Delete
          </CButton>
        </CModalFooter>
      </CModal>
    </CContainer>
  );
};

export default UserList;
