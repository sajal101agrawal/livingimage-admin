import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilBell,
  cilCalculator,
  cilChartPie,
  cilCursor,
  cilDescription,
  cilDrop,
  cilNotes,
  cilPencil,
  cilPuzzle,
  cilSpeedometer,
  cilStar,
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

const _nav = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  },

  {
    component: CNavTitle,
    name: 'Users',
  },
  {
    component: CNavItem,
    name: 'All Users',
    to: '/users',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  },

  {
    component: CNavTitle,
    name: 'Images',
  },
  {
    component: CNavItem,
    name: 'Regenerated',
    to: '/regenerated-images',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Original',
    to: '/original-images',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  },




  {
    component: CNavTitle,
    name: 'Payments',
  },
  {
    component: CNavItem,
    name: 'All Payments',
    to: '/payments',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  },





]

export default _nav
