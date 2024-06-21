import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import {
  CButton,
  CButtonGroup,
  CCard,
  CCardBody,
  CCardFooter,
  CCol,
  CRow,
  CSpinner,
  CAlert,
} from '@coreui/react';
import { logout } from '../../utils/Logout';
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const [googleAnalytics, setGoogleAnalytics] = useState(null);
  const [smallAnalytics, setSmallAnalytics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [smallLoading, setSmallLoading] = useState(false);
  const [smallErrorMsg, setSmallErrorMsg] = useState('');
  const [frequency, setFrequency] = useState('day'); // frequency as 'day' or 'week' or 'month'

  const accessToken = localStorage.getItem('AccessToken');

  useEffect(() => {
    fetchGoogleAnalytics();
    fetchSmallAnalytics();
  }, [frequency]);

  const fetchGoogleAnalytics = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        'https://api.livingimage.io/api/admin/google-analytics/',
        { date_filter: frequency },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      // Reverse the data arrays
      const reversedData = {
        ...response.data,
        date: response.data.date.reverse(),
        pageViews: response.data.pageViews.reverse(),
        users: response.data.users.reverse(),
        newUsers: response.data.newUsers.reverse(),
        averageSessionDuration: response.data.averageSessionDuration.reverse(),
      };
      setGoogleAnalytics(reversedData);
      setErrorMsg(''); // Clear any previous error messages
    } catch (error) {
      console.error('Error fetching Google Analytics:', error);
      setErrorMsg(error?.response?.data?.errors?.detail || 'Failed to fetch Google Analytics data.');
      if (error?.response?.status === 401) {
        logout();
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchSmallAnalytics = async () => {
    setSmallLoading(true);
    try {
      const response = await axios.post(
        'https://api.livingimage.io/api/admin/analytics/',
        { date_filter: frequency },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      // Reverse the data array
      setSmallAnalytics(response.data.reverse());
      setSmallErrorMsg(''); // Clear any previous error messages
    } catch (error) {
      console.error('Error fetching small analytics:', error);
      setSmallErrorMsg(error?.response?.data?.errors?.detail || 'Failed to fetch small analytics data.');
      if (error?.response?.status === 401) {
        logout();
      }
    } finally {
      setSmallLoading(false);
    }
  };

  const mainChartData = {
    labels: googleAnalytics?.date || [],
    datasets: [
      {
        label: 'Page Views',
        backgroundColor: 'rgba(75,192,192,0.4)',
        borderColor: 'rgba(75,192,192,1)',
        borderWidth: 1,
        hoverBackgroundColor: 'rgba(75,192,192,0.8)',
        hoverBorderColor: 'rgba(75,192,192,1)',
        data: googleAnalytics?.pageViews || [],
      },
      {
        label: 'Users',
        backgroundColor: 'rgba(255,99,132,0.4)',
        borderColor: 'rgba(255,99,132,1)',
        borderWidth: 1,
        hoverBackgroundColor: 'rgba(255,99,132,0.8)',
        hoverBorderColor: 'rgba(255,99,132,1)',
        data: googleAnalytics?.users || [],
      },
      {
        label: 'New Users',
        backgroundColor: 'rgba(54,162,235,0.4)',
        borderColor: 'rgba(54,162,235,1)',
        borderWidth: 1,
        hoverBackgroundColor: 'rgba(54,162,235,0.8)',
        hoverBorderColor: 'rgba(54,162,235,1)',
        data: googleAnalytics?.newUsers || [],
      },
      {
        label: 'Average Session Duration (minutes)',
        backgroundColor: 'rgba(255,206,86,0.4)',
        borderColor: 'rgba(255,206,86,1)',
        borderWidth: 1,
        hoverBackgroundColor: 'rgba(255,206,86,0.8)',
        hoverBorderColor: 'rgba(255,206,86,1)',
        data: googleAnalytics?.averageSessionDuration.map(duration => duration / 60) || [],
      },
    ],
  };

  const mainChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Google Analytics Data',
      },
    },
  };

  const smallGraphsData = [
    {
      label: 'Total Users',
      key: 'Total user',
      backgroundColor: 'rgba(75,192,192,0.4)',
      borderColor: 'rgba(75,192,192,1)',
    },
    {
      label: 'Total Original Images',
      key: 'Total Original Images',
      backgroundColor: 'rgba(255,99,132,0.4)',
      borderColor: 'rgba(255,99,132,1)',
    },
    {
      label: 'Total Regenerated Images',
      key: 'Total Regenerated Images',
      backgroundColor: 'rgba(54,162,235,0.4)',
      borderColor: 'rgba(54,162,235,1)',
    },
    {
      label: 'Total Payments',
      key: 'Total Payments',
      backgroundColor: 'rgba(255,206,86,0.4)',
      borderColor: 'rgba(255,206,86,1)',
    },
    {
      label: 'Total Payment Amount',
      key: 'Total Payment Amount',
      backgroundColor: 'rgba(75,192,192,0.4)',
      borderColor: 'rgba(75,192,192,1)',
    },
    {
      label: 'Total Credit Records',
      key: 'Total Credit Records',
      backgroundColor: 'rgba(255,99,132,0.4)',
      borderColor: 'rgba(255,99,132,1)',
    },
    {
      label: 'Total Credit Added',
      key: 'Total Credit Added',
      backgroundColor: 'rgba(54,162,235,0.4)',
      borderColor: 'rgba(54,162,235,1)',
    },
    {
      label: 'Total Credit Deducted',
      key: 'Total Credit Deducted',
      backgroundColor: 'rgba(255,206,86,0.4)',
      borderColor: 'rgba(255,206,86,1)',
    },
  ];

  const renderSmallGraphs = () => {
    return smallGraphsData.map((graph, index) => {
      const data = {
        labels: smallAnalytics.map((_, i) => i + 1), // Change this to `i + 1` to avoid showing time ranges
        datasets: [
          {
            label: graph.label,
            backgroundColor: graph.backgroundColor,
            borderColor: graph.borderColor,
            borderWidth: 1,
            hoverBackgroundColor: graph.hoverBackgroundColor,
            hoverBorderColor: graph.hoverBorderColor,
            data: smallAnalytics.map(item => parseFloat(item[graph.key])),
          },
        ],
      };

      const options = {
        responsive: true,
        plugins: {
          legend: {
            display: false,
          },
          title: {
            display: true,
            text: graph.label,
          },
        },
        scales: {
          x: {
            display: false,
          },
        },
      };

      return (
        <CCol key={index} sm="6" lg="3">
          <CCard className="mb-4">
            <CCardBody>
              {smallLoading && <CSpinner color="primary" />}
              {!smallLoading && smallErrorMsg && <CAlert color="danger">{smallErrorMsg}</CAlert>}
              {!smallLoading && !smallErrorMsg && <Line data={data} options={options} />}
            </CCardBody>
          </CCard>
        </CCol>
      );
    });
  };

  return (
    <>
      <CCard className="mb-4">
        <CCardBody>
          <CRow>
            <CCol sm={5}>
              <h4 id="traffic" className="card-title mb-0">
                Traffic
              </h4>
              <div className="small text-body-secondary">Website Visitors</div>
            </CCol>
            <CCol sm={7} className="d-none d-md-block">
              <CButtonGroup className="float-end me-3">
                {['Day', 'Week', 'Month'].map((value) => (
                  <CButton
                    color="outline-secondary"
                    key={value}
                    className="mx-0"
                    active={frequency === value.toLowerCase()}
                    onClick={() => setFrequency(value.toLowerCase())}
                  >
                    {value}
                  </CButton>
                ))}
              </CButtonGroup>
            </CCol>
          </CRow>
          {loading && <CSpinner color="primary" />}
          {!loading && errorMsg && <CAlert color="danger">{errorMsg}</CAlert>}
          {!loading && !errorMsg && googleAnalytics && <Line data={mainChartData} options={mainChartOptions} />}
        </CCardBody>
        <CCardFooter>
          {loading && <div>Loading...</div>}
          {errorMsg && (
            <div style={{ color: 'red' }}>
              Error: {errorMsg || 'An error occurred while fetching data.'}
            </div>
          )}
        </CCardFooter>
      </CCard>

      <CRow>{renderSmallGraphs()}</CRow>
    </>
  );
};

export default Dashboard;
