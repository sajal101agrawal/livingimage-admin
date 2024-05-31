import React from 'react'
import { logout } from '../../utils/Logout'

const AppHeaderDropdown = () => {
  return (
    <div 
    style={{display:"flex", justifyContent:"center", alignItems:"Center", padding:"10px", textDecoration:"underline", cursor:"pointer"}}
    onClick={logout}
    >
      Logout
    </div>
  )
}

export default AppHeaderDropdown
