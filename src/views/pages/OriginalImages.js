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
  CPagination,
  CPaginationItem,
  CFormInput,
} from '@coreui/react';
import axios from 'axios';
import { logout } from './../../utils/Logout';

const OriginalImages = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [count, setCount] = useState(0);

  useEffect(() => {
    fetchImages(page);
  }, [page]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((prevCount) => prevCount + 1);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchImages = async (page) => {
    setLoading(true);
    setErrorMsg('');
    const accessToken = localStorage.getItem('AccessToken');
    try {
      const response = await axios.post(
        `https://api.livingimage.io/api/admin/get-all-original-admin/?page=${page}`,
        null,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const data = response.data.results;
      setImages(data.Original_Image_data);
      setTotalPages(Math.ceil(response.data.count / 10)); // Assuming 10 items per page
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

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredImages = images.filter((image) => {
    return (
      image.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      image.original_image_id.toString().includes(searchTerm.toLowerCase()) ||
      image.original_image_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      image.original_image.toLowerCase().includes(searchTerm.toLowerCase()) ||
      image.prompt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      image.created.toLowerCase().includes(searchTerm.toLowerCase()) ||
      image.user_image_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      image.tag?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      image.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <CContainer>
      <CRow>
        <CCol>
          <CCard>
            <CCardHeader>
              <strong>Original Images</strong>
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
              {loading ? (
                <div className="text-center">
                  <CSpinner color="primary" />
                </div>
              ) : (
                <CRow>
                  {filteredImages.map((image) => (
                    <CCol md="4" key={image.original_image_id} className="mb-4">
                      <CCard>
                        <img
                          src={`${image.original_image}?count=${count}`}
                          alt={image.original_image_name}
                          className="card-img-top"
                        />
                        <CCardBody>
                          <p><strong>User:</strong> {image.user}</p>
                          <p><strong>Image ID:</strong> {image.original_image_id}</p>
                          <p><strong>Name:</strong> {image.original_image_name}</p>
                          <p><strong>Prompt:</strong> {image.prompt}</p>
                          <p><strong>Created:</strong> {image.created}</p>
                          <p><strong>Regenerated At:</strong> {image.regenerated_at}</p>
                          <p><strong>Next Regeneration At:</strong> {image.next_regeneration_at}</p>
                          <p><strong>User Image Name:</strong> {image.user_image_name || 'N/A'}</p>
                          <p><strong>Tag:</strong> {image.tag || 'N/A'}</p>
                          <p><strong>Description:</strong> {image.description || 'N/A'}</p>
                        </CCardBody>
                      </CCard>
                    </CCol>
                  ))}
                </CRow>
              )}
              <CPagination align="center" aria-label="Page navigation">
                <CPaginationItem
                  disabled={page === 1}
                  onClick={() => handlePageChange(page - 1)}
                >
                  Previous
                </CPaginationItem>
                {Array.from({ length: totalPages }, (_, index) => (
                  <CPaginationItem
                    key={index + 1}
                    active={page === index + 1}
                    onClick={() => handlePageChange(index + 1)}
                  >
                    {index + 1}
                  </CPaginationItem>
                ))}
                <CPaginationItem
                  disabled={page === totalPages}
                  onClick={() => handlePageChange(page + 1)}
                >
                  Next
                </CPaginationItem>
              </CPagination>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  );
};

export default OriginalImages;
