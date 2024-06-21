import React, { useState, useEffect } from 'react'
import axios from 'axios'
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CFormInput,
  CRow,
  CSpinner,
  CTable,
  CTableBody,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CTableDataCell,
} from '@coreui/react'
import { FaSort, FaSortUp, FaSortDown } from 'react-icons/fa'

const Payments = () => {
  const [payments, setPayments] = useState([])
  const [filteredPayments, setFilteredPayments] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortConfig, setSortConfig] = useState({ key: '', direction: 'asc' })

  const accessToken = localStorage.getItem('AccessToken')

  useEffect(() => {
    const fetchPayments = async () => {
      setIsLoading(true)
      const url = 'https://api.livingimage.io/api/admin/get-all-payment/'
      const headers = {
        Authorization: `Bearer ${accessToken}`,
      }

      try {
        const response = await axios.post(url, {}, { headers })
        setPayments(response.data['Payment List'])
        setFilteredPayments(response.data['Payment List'])
        setIsLoading(false)
      } catch (err) {
        setError(err.message || 'Something went wrong')
        setIsLoading(false)
      }
    }

    fetchPayments()
  }, [])

  const handleSearch = () => {
    const term = searchTerm.toLowerCase()
    const results = payments.filter(
      (payment) =>
        payment['User Email'].toLowerCase().includes(term) ||
        payment['Payment Status'].toLowerCase().includes(term) ||
        payment['Payment Amount'].toLowerCase().includes(term) ||
        payment['Payment ID'].toString().includes(term) ||
        payment['Total Credits'].toString().includes(term) ||
        payment['Payment time'].toLowerCase().includes(term) ||
        payment['Payment Gateway ID'].toLowerCase().includes(term),
    )
    setFilteredPayments(results)
  }

  useEffect(() => {
    handleSearch()
  }, [searchTerm, payments])

  const handleSort = (key) => {
    let direction = 'asc'
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc'
    }
    setSortConfig({ key, direction })

    const sortedPayments = [...filteredPayments].sort((a, b) => {
      if (a[key] < b[key]) return direction === 'asc' ? -1 : 1
      if (a[key] > b[key]) return direction === 'asc' ? 1 : -1
      return 0
    })
    setFilteredPayments(sortedPayments)
  }

  const getSortIcon = (key) => {
    if (sortConfig.key === key) {
      if (sortConfig.direction === 'asc') {
        return <FaSortUp />
      } else {
        return <FaSortDown />
      }
    } else {
      return <FaSort />
    }
  }

  if (isLoading) {
    return (
      <CContainer className="min-vh-100 d-flex align-items-center justify-content-center">
        <CSpinner color="primary" />
      </CContainer>
    )
  }

  if (error) {
    return (
      <CContainer className="min-vh-100 d-flex align-items-center justify-content-center">
        <div>Error: {error}</div>
      </CContainer>
    )
  }

  return (
    <CContainer className="mt-5">
      <CRow className="justify-content-center">
        <CCol md={12}>
          <CCard className="p-4">
            <CCardBody>
              <h1>Payments</h1>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                <CFormInput
                  type="text"
                  placeholder="Search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {/* <CButton onClick={handleSearch}>Search</CButton> */}
              </div>
              <CTable style={{ display: 'block', overflowX: 'scroll' }}>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell onClick={() => handleSort('Payment ID')}>
                      ID {getSortIcon('Payment ID')}
                    </CTableHeaderCell>
                    <CTableHeaderCell onClick={() => handleSort('User Email')}>
                      Email {getSortIcon('User Email')}
                    </CTableHeaderCell>
                    <CTableHeaderCell onClick={() => handleSort('Payment Amount')}>
                      Amount {getSortIcon('Payment Amount')}
                    </CTableHeaderCell>
                    <CTableHeaderCell onClick={() => handleSort('Total Credits')}>
                      Credits {getSortIcon('Total Credits')}
                    </CTableHeaderCell>
                    <CTableHeaderCell onClick={() => handleSort('Payment time')}>
                      Time {getSortIcon('Payment time')}
                    </CTableHeaderCell>
                    <CTableHeaderCell onClick={() => handleSort('Payment Status')}>
                      Status {getSortIcon('Payment Status')}
                    </CTableHeaderCell>
                    <CTableHeaderCell onClick={() => handleSort('Payment Gateway ID')}>
                      Payment Gateway ID {getSortIcon('Payment Gateway ID')}
                    </CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {filteredPayments.map((payment) => (
                    <CTableRow key={payment['Payment ID']}>
                      <CTableDataCell>#{payment['Payment ID']}</CTableDataCell>
                      <CTableDataCell>{payment['User Email']}</CTableDataCell>
                      <CTableDataCell>${payment['Payment Amount']}</CTableDataCell>
                      <CTableDataCell>{payment['Total Credits']}</CTableDataCell>
                      <CTableDataCell>{payment['Payment time']}</CTableDataCell>
                      <CTableDataCell
                        style={{
                          color: payment['Payment Status'].toLowerCase() === 'paid' ? 'green' : '',
                        }}
                      >
                        {payment['Payment Status']}
                      </CTableDataCell>
                      <CTableDataCell
                        style={{
                          fontSize: '0.8rem',
                          wordWrap: 'break-word',
                          whiteSpace: 'pre-wrap',
                        }}
                      >
                        {payment['Payment Gateway ID'].substring(0, 30)}
                      </CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  )
}

export default Payments
