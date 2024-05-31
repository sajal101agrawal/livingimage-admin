import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import {
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CRow,
  CSpinner,
} from '@coreui/react';
import './ViewUser.css';
import { Navigate } from 'react-router-dom';

const ViewUser = () => {
  const { id } = useParams();
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const navigate = useNavigate();

  const accessToken = localStorage.getItem('AccessToken');

  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      const url = 'https://api.livingimage.io/api/admin/view-user/';
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      };

      try {
        const response = await axios.post(url, { email: id }, { headers });
        setUserData(response.data);
        setIsLoading(false);
      } catch (err) {
        setError(err.message || 'Something went wrong');
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [id]);

  if (isLoading) {
    return (
      <CContainer className="min-vh-100 d-flex align-items-center justify-content-center">
        <CSpinner color="primary" />
      </CContainer>
    );
  }

  if (error) {
    return (
      <CContainer className="min-vh-100 d-flex align-items-center justify-content-center">
        <div>Error: {error}</div>
      </CContainer>
    );
  }

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
                <p>Verification Status: {userData.user_data['Verification Status'] ? 'Verified' : 'Not Verified'}</p>
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
          <div className="image-container">
            <div className="image-column">
              <h3>Original Images</h3>
              <div className="image-grid">
                {userData.Original_Image_data.map((image) => (
                  <CCard key={image.original_image_id} className="m-2 image-card">
                    <CCardBody>
                      <img src={image.original_image} alt={image.original_image_name} className="image" />
                      <p><strong>Name:</strong> {image.original_image_name}</p>
                      <p><strong>Created:</strong> {image.created}</p>
                      <p><strong>Prompt:</strong> {image.prompt}</p>
                      <p><strong>Public:</strong> {image.public ? 'Yes' : 'No'}</p>
                      <p><strong>Regenerated At:</strong> {image.regenerated_at}</p>
                      <p><strong>Next Regeneration:</strong> {image.next_regeneration_at}</p>
                    </CCardBody>
                  </CCard>
                ))}
              </div>
            </div>
            <div className="image-column">
              <h3>Regenerated Images</h3>
              <p>*Click on image to view it's original side by side.</p>
              <div className="image-grid">
                {userData.Regenerated_Image_data.map((image) => (
                  <CCard onClick={() => navigate(`/view-image?original=${image.original_image_id}&regenerated=${image.regenerated_image_id}`)} key={image.regenerated_image_id} className="m-2 image-card" style={{cursor:"pointer"}}>
                    <CCardBody>
                      <img src={image.regenerated_image} alt={image.original_image_name} className="image" />
                      <p><strong>Name:</strong> {image.original_image_name}</p>
                      <p><strong>Created:</strong> {image.created}</p>
                      <p><strong>Regenerated At:</strong> {image.regenerated_at}</p>
                      <p><strong>Next Regeneration:</strong> {image.next_regeneration_at}</p>
                    </CCardBody>
                  </CCard>
                ))}
              </div>
            </div>
          </div>
        </CCol>
      </CRow>
    </CContainer>
  );
};

export default ViewUser;
