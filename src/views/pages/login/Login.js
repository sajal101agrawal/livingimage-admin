import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'
import axios from 'axios'

const Login = () => {
  const navigate = useNavigate()
  const initialvalue = {
    email: '',
    password: '',
  }

  const [loginData, setLoginData] = useState(initialvalue)
  const [isLoader, setIsLoader] = useState(false)
  const [mailErrorMsg, setMailErrorMsg] = useState('')
  const [passwordErrorMsg, setPasswordErrorMsg] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [loginsuccess, setLoginSuccess] = useState(false)

  const handleChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value })
  }

  const signinApiCall = async (data) => {
    setIsLoader(true)
    const url = 'https://api.livingimage.io/api/login/'
    const header = {
      'Content-Type': 'application/json',
    }
    try {
      const res = await axios.post(url, data, header)
      console.log('RESPONSE RECEIVED: ', res, res.status)
      if (res.status === 200) {
        if (res.data.Message === 'Verify your account First!') {
          setErrorMsg('Account not verified!')
        } else if (res?.data?.admin) {
          setLoginData(initialvalue)
          localStorage.setItem('AuthData', JSON.stringify(res.data))
          localStorage.setItem('Verified', res.data.verified ? res.data.verified : false)
          localStorage.setItem('AccessToken', res.data.token.access)
          setLoginSuccess(true)
          navigate("/dashboard");
          window.location.reload();
        } else {
          setErrorMsg('Only admin can access..')
        }
        setIsLoader(false)
      }
    } catch (err) {
      console.log('AXIOS ERROR: ', err)
      setIsLoader(false)
      setLoginData(initialvalue)
      localStorage.setItem('Verified', false)
      setErrorMsg(err.response.data.Message)
      if (err.response.status === 401) {
        logout()
      }
    }
  }

  const handleSignIn = () => {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i
    if (loginData.email === '' || loginData.password === '' || !emailRegex.test(loginData.email)) {
      if (loginData.email === '') {
        setMailErrorMsg('Please enter email')
      } else if (emailRegex.test(loginData.email)) {
        setMailErrorMsg('')
      } else {
        setMailErrorMsg('Please enter valid email')
      }

      if (loginData.password === '') {
        setPasswordErrorMsg('Please enter password')
      } else {
        setPasswordErrorMsg('')
      }
    } else if (loginData.email !== '' && loginData.password !== '') {
      signinApiCall(loginData)
    }
  }

  useEffect(() => {
    if (loginData.email === '') {
      setMailErrorMsg('')
    }
    if (loginData.password === '') {
      setPasswordErrorMsg('')
    }
  }, [loginData])

  useEffect(() => {
    const timer = setTimeout(() => {
      setErrorMsg('')
    }, 3000)
    return () => clearTimeout(timer)
  }, [errorMsg])

  useEffect(() => {
    if (loginsuccess) {
      navigate('/dashboard')
    }
  }, [loginsuccess, navigate])

  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={5}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm>
                    <h1>Login</h1>
                    <p className="text-body-secondary">Sign In to your account</p>
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput
                        placeholder="Email"
                        autoComplete="username"
                        onChange={handleChange}
                        value={loginData.email}
                        name="email"
                      />
                    </CInputGroup>
                    <div style={{ color: 'red', fontSize: '14px', marginBottom: '12px' }}>
                      {mailErrorMsg}
                    </div>
                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        type="password"
                        placeholder="Password"
                        autoComplete="current-password"
                        onChange={handleChange}
                        value={loginData.password}
                        name="password"
                      />
                    </CInputGroup>
                    <div style={{ color: 'red', fontSize: '14px', marginBottom: '12px' }}>
                      {passwordErrorMsg}
                    </div>
                    <div style={{ color: 'red', fontSize: '14px', marginBottom: '12px' }}>
                      {errorMsg}
                    </div>

                    <div className="w-full flex justify-center items-center">
                      {isLoader ? (
                        <div role="status">
                          <span className="sr-only">Loading...</span>
                        </div>
                      ) : (
                        <CRow>
                          <CCol xs={6}>
                            <CButton color="primary" className="px-4" onClick={handleSignIn}>
                              Login
                            </CButton>
                          </CCol>
                        </CRow>
                      )}
                    </div>
                  </CForm>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>

        {loginsuccess ? (
          <div>
            Successfully Logged in. Go to{' '}
            <a style={{ textDecoration: 'underline', color: 'lightblue' }} href="/dashboard">
              dashboard
            </a>
            .
          </div>
        ) : (
          ''
        )}
      </CContainer>
    </div>
  )
}

export default Login
