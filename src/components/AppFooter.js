import React from 'react'
import { CFooter } from '@coreui/react'

const AppFooter = () => {
  return (
    <CFooter className="px-4">
      <div>
        <a href="https://livingimage.io" target="_blank" rel="noopener noreferrer">
          Livingimage
        </a>
        <span className="ms-1">&copy; 2024 | LIVINGIMAGE LLC</span>
      </div>
      <div className="ms-auto">
        <span className="me-1">Developed by</span>
        <a href="https://livingimage.io" target="_blank" rel="noopener noreferrer">
          Livingimage Team
        </a>
      </div>
    </CFooter>
  )
}

export default React.memo(AppFooter)
