import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CRow, CCol, CDropdown, CDropdownMenu, CDropdownItem, CDropdownToggle, CWidgetStatsA } from '@coreui/react';
import { CChartLine } from '@coreui/react-chartjs';
import CIcon from '@coreui/icons-react';
import { cilArrowBottom, cilArrowTop, cilOptions } from '@coreui/icons';
import { getStyle } from '@coreui/utils';
import { logout } from './../../utils/Logout';

const WidgetsDropdown = () => {
  const [analyticsData, setAnalyticsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [filter, setFilter] = useState('day'); // 'day' or 'week' or 'month'

  const accessToken = localStorage.getItem('AccessToken')


  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        'https://api.livingimage.io/api/admin/analytics/',
        { date_filter: filter },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setAnalyticsData(response.data);
      setErrorMsg('');
    } catch (error) {
      console.error('Error fetching Analytics data:', error);
      setErrorMsg(
        error?.response?.data?.errors?.detail ||
          'Failed to fetch Analytics data.'
      );
      if (error?.response?.status === 401) {
        logout();
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <CRow className="mb-4" xs={{ gutter: 4 }}>
      <CCol sm={6} xl={4} xxl={3}>
        <CWidgetStatsA
          color="primary"
          value={
            <>
              {loading ? 'Loading...' : analyticsData[0]?.['Total user']}
            </>
          }
          title="Total Users"
          chart={
            <CChartLine
              className="mt-3 mx-3"
              style={{ height: '70px' }}
              data={{
                labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                datasets: [
                  {
                    label: 'Total Users',
                    backgroundColor: 'transparent',
                    borderColor: 'rgba(255,255,255,.55)',
                    pointBackgroundColor: getStyle('--cui-primary'),
                    data: loading ? [] : analyticsData.map(data => data['Total user']),
                  },
                ],
              }}
              options={{
                plugins: {
                  legend: {
                    display: false,
                  },
                },
                maintainAspectRatio: false,
                scales: {
                  x: {
                    border: {
                      display: false,
                    },
                    grid: {
                      display: false,
                      drawBorder: false,
                    },
                    ticks: {
                      display: false,
                    },
                  },
                  y: {
                    min: 0,
                    display: false,
                    grid: {
                      display: false,
                    },
                    ticks: {
                      display: false,
                    },
                  },
                },
                elements: {
                  line: {
                    borderWidth: 1,
                    tension: 0.4,
                  },
                  point: {
                    radius: 4,
                    hitRadius: 10,
                    hoverRadius: 4,
                  },
                },
              }}
            />
          }
        />
      </CCol>
      {/* Render other widgets similarly */}
    </CRow>
  );
};

export default WidgetsDropdown;
