import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import {
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CRow,
  CSpinner,
  CInputGroup,
  CInputGroupText,
  CFormInput,
} from '@coreui/react'
import { cilSearch } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import './ViewUser.css'

const ViewUser = () => {
  const { id } = useParams()
  const [userData, setUserData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

  const navigate = useNavigate()

  const accessToken = localStorage.getItem('AccessToken')

  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true)
      const url = 'https://api.livingimage.io/api/admin/view-user/'
      const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      }

      try {
        const response = await axios.post(url, { email: id }, { headers })
        setUserData(response.data)
        setIsLoading(false)
      } catch (err) {
        setError(err.message || 'Something went wrong')
        setIsLoading(false)
      }
    }

    fetchUserData()
  }, [id])

  const handleSearch = (e) => {
    setSearchTerm(e.target.value.toLowerCase())
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

  const filteredOriginalImages = userData.Original_Image_data.filter((image) =>
    image.original_image_name.toLowerCase().includes(searchTerm),
  )

  const filteredRegeneratedImages = userData.Regenerated_Image_data.filter((image) =>
    image.original_image_name.toLowerCase().includes(searchTerm),
  )

  return (
    <CContainer className="mt-5">
      <CRow className="justify-content-center">
        <CCol md={12}>
          <CCardGroup>
            <CCard className="p-4">
              <CCardBody>
                <h1>User Details</h1>
                <p>Email: {userData.user_data['User Email']}</p>
                <p>Name: {userData.user_data['User Name']}</p>
                <p>Total Credits: {userData.user_data['Total Credits']}</p>
                <p>Registered on: {userData.user_data['Registered on']}</p>
                <p>
                  Verification Status:{' '}
                  {userData.user_data['Verification Status'] ? 'Verified' : 'Not Verified'}
                </p>
                <p>Stripe Customer ID: {userData.user_data['Stripe Customer ID']}</p>
                <p>Membership Name: {userData.user_data['Membership Name']}</p>
                <p>Membership Expiry: {userData.user_data['Membership Expiry']}</p>
                {/* Add more user details as needed */}
              </CCardBody>
            </CCard>
          </CCardGroup>
        </CCol>
      </CRow>

      <CRow className="mt-5">
        <CCol>
          <h2>Images</h2>
          {/* <CInputGroup className="mb-3">
            <CInputGroupText>
              <CIcon icon={cilSearch} />
            </CInputGroupText>
            <CFormInput 
              type="text"
              placeholder="Search Images"
              value={searchTerm}
              onChange={handleSearch}
            />
          </CInputGroup> */}

          <div className="image-table">
            <table className="table">
              <thead>
                <tr>
                  <th>Original Images</th>
                  <th>Regenerated Images</th>
                </tr>
              </thead>
              <tbody>
                {filteredOriginalImages.map((originalImage, index) => {
                  const regeneratedImage = filteredRegeneratedImages.find(
                    (img) => img.original_image_id === originalImage.original_image_id,
                  )
                  return (
                    <tr key={originalImage.original_image_id}>
                      <td>
                        <CCard className="image-card">
                          <CCardBody>
                            

                            {originalImage.original_image ? (
                              <img
                              src={originalImage.original_image}
                              alt={originalImage.original_image_name}
                              className="image"
                            />
                            ) : (
                              <span
                                className="card-img-top"
                                style={{
                                  background: '#f8f7f7',
                                  textAlign: 'center',
                                  fontSize: '1rem',
                                  minHeight: '200px',
                                  display: 'flex',
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                  color: 'black',
                                  padding: '10px',
                                }}
                              >
                                {originalImage.prompt}
                              </span>
                            )}

                            <p>
                              <strong>Name:</strong> {originalImage.original_image_name}
                            </p>
                            <p>
                              <strong>Created:</strong> {originalImage.created}
                            </p>
                            <p>
                              <strong>Prompt:</strong> {originalImage.prompt}
                            </p>
                            <p>
                              <strong>Public:</strong> {originalImage.public ? 'Yes' : 'No'}
                            </p>
                            <p>
                              <strong>Regenerated At:</strong> {originalImage.regenerated_at}
                            </p>
                            <p>
                              <strong>Next Regeneration:</strong>{' '}
                              {originalImage.next_regeneration_at}
                            </p>
                          </CCardBody>
                        </CCard>
                      </td>
                      <td>
                        {regeneratedImage ? (
                          <CCard
                            onClick={() =>
                              navigate(
                                `/view-image?original=${originalImage.original_image_id}&regenerated=${regeneratedImage.regenerated_image_id}`,
                              )
                            }
                            key={regeneratedImage.regenerated_image_id}
                            className="m-2 image-card"
                            style={{ cursor: 'pointer' }}
                          >
                            <CCardBody>
                              <img
                                src={regeneratedImage.regenerated_image}
                                alt={regeneratedImage.original_image_name}
                                className="image"
                              />
                              <p>
                                <strong>Name:</strong> {regeneratedImage.original_image_name}
                              </p>
                              <p>
                                <strong>Created:</strong> {regeneratedImage.created}
                              </p>
                              <p>
                                <strong>Regenerated At:</strong> {regeneratedImage.regenerated_at}
                              </p>
                              <p>
                                <strong>Next Regeneration:</strong>{' '}
                                {regeneratedImage.next_regeneration_at}
                              </p>
                            </CCardBody>
                          </CCard>
                        ) : (
                          <div>No Regenerated Image</div>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </CCol>
      </CRow>
    </CContainer>
  )
}

export default ViewUser
