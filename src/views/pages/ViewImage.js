import React, { useEffect, useState } from 'react';
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CContainer,
  CRow,
  CSpinner,
  CAlert,
} from '@coreui/react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { logout } from './../../utils/Logout';

const ViewImage = () => {
  const [originalImage, setOriginalImage] = useState(null);
  const [regeneratedImage, setRegeneratedImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const originalImageId = queryParams.get('original');
  const regeneratedImageId = queryParams.get('regenerated');

  useEffect(() => {
    if (originalImageId && regeneratedImageId) {
      fetchImages(originalImageId, regeneratedImageId);
    }
  }, [originalImageId, regeneratedImageId]);

  const fetchImages = async (originalId, regeneratedId) => {
    setLoading(true);
    setErrorMsg('');
    const accessToken = localStorage.getItem('AccessToken');
    try {
      const [originalResponse, regeneratedResponse] = await Promise.all([
        axios.post(
          'https://api.livingimage.io/api/admin/get-one-original-admin/',
          { image_id: originalId },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
          }
        ),
        axios.post(
          'https://api.livingimage.io/api/admin/get-one-regen-admin/',
          { image_id: regeneratedId },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
          }
        ),
      ]);

      setOriginalImage(originalResponse.data.Original_Image_data);
      setRegeneratedImage(regeneratedResponse.data.Regenerated_Image_data);
    } catch (error) {
      console.error('Error fetching images:', error);
      setErrorMsg(error?.response?.data?.errors?.detail || 'Failed to fetch images');
      if (error?.response?.status === 401) {
        logout();
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <CContainer>
      <CRow>
        <CCol>
          <CCard>
            <CCardHeader>
              <strong>View Image</strong>
            </CCardHeader>
            <CCardBody>
              {errorMsg && <CAlert color="danger">{errorMsg}</CAlert>}
              {loading ? (
                <div className="text-center">
                  <CSpinner color="primary" />
                </div>
              ) : (
                <CRow>
                    <CCol md="6" className="mb-4">
                    <CCard>
                      <CCardHeader>
                        <strong>Regenerated Image</strong>
                      </CCardHeader>
                      <CCardBody>
                        {regeneratedImage ? (
                          <>
                            <img
                              src={regeneratedImage.regenerated_image}
                              alt={regeneratedImage.original_image_name}
                              className="img-fluid"
                            />
                            <hr />
                            <p><strong>User:</strong> {regeneratedImage.user}</p>
                            <p><strong>Image ID:</strong> {regeneratedImage.regenerated_image_id}</p>
                            <p><strong>Name:</strong> {regeneratedImage.original_image_name}</p>
                            <p><strong>Created:</strong> {regeneratedImage.created}</p>
                            <p><strong>Regenerated At:</strong> {regeneratedImage.regenerated_at}</p>
                            <p><strong>Next Regeneration At:</strong> {regeneratedImage.next_regeneration_at}</p>
                          </>
                        ) : (
                          <p>No regenerated image found</p>
                        )}
                      </CCardBody>
                    </CCard>
                  </CCol>
                  <CCol md="6" className="mb-4">
                    <CCard>
                      <CCardHeader>
                        <strong>Original Image</strong>
                      </CCardHeader>
                      <CCardBody>
                        {originalImage ? (
                          <>
                            <img
                              src={originalImage.original_image}
                              alt={originalImage.original_image_name}
                              className="img-fluid"
                            />
                            <hr />
                            <p><strong>User:</strong> {originalImage.user}</p>
                            <p><strong>Image ID:</strong> {originalImage.original_image_id}</p>
                            <p><strong>Name:</strong> {originalImage.original_image_name}</p>
                            <p><strong>Prompt:</strong> {originalImage.prompt}</p>
                            <p><strong>Created:</strong> {originalImage.created}</p>
                            <p><strong>Regenerated At:</strong> {originalImage.regenerated_at}</p>
                            <p><strong>Next Regeneration At:</strong> {originalImage.next_regeneration_at}</p>
                            <p><strong>User Image Name:</strong> {originalImage.user_image_name || 'N/A'}</p>
                            <p><strong>Tag:</strong> {originalImage.tag || 'N/A'}</p>
                            <p><strong>Description:</strong> {originalImage.description || 'N/A'}</p>
                          </>
                        ) : (
                          <p>No original image found</p>
                        )}
                      </CCardBody>
                    </CCard>
                  </CCol>
                  
                </CRow>
              )}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  );
};

export default ViewImage;
