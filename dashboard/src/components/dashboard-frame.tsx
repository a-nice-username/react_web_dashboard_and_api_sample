import { ReactNode } from 'react'

import { Link, useHistory } from 'react-router-dom'

import { getLocation } from '../references'

type PropsType = {
  selectedSection: 'dashboard' | 'users' | 'administrators' | 'pictures' | 'registerAnAccount',
  onLogout?: () => void,
  children?: ReactNode
}

function DashboardFrame(props: PropsType) {
  const history = useHistory()

  const { children, selectedSection } = props

  return (
    <div
      className = 'dashboard_container'
    >
      <div
        className = 'dashboard_side_bar'
      >
        <h2
          className = 'dashboard_side_bar_title'
        >
          Pictures App
        </h2>

        <div
          className = 'dashboard_side_bar_content'
        >
          <div
            className = 'dashboard_section'
          >
            MAIN NAVIGATION
          </div>

          <Link
            className = {selectedSection == 'dashboard' ? 'dashboard_section_selected_item' : 'dashboard_section_item'}
            to = '/'
          >
            Dashboard
          </Link>

          <Link
            className = {selectedSection == 'users' ? 'dashboard_section_selected_item' : 'dashboard_section_item'}
            to = '/users'
          >
            Users
          </Link>

          <Link
            className = {selectedSection == 'administrators' ? 'dashboard_section_selected_item' : 'dashboard_section_item'}
            to = '/administrators'
          >
            Administrators
          </Link>

          <Link
            className = {selectedSection == 'pictures' ? 'dashboard_section_selected_item' : 'dashboard_section_item'}
            to = '/pictures'
          >
            Pictures
          </Link>

          <div
            className = 'dashboard_section'
          >
            OTHER
          </div>

          <a
            className = {selectedSection == 'registerAnAccount' ? 'dashboard_section_selected_item' : 'dashboard_section_item'}
            href = 'javascript:void(0)'
            onClick = {() => {
              history.push(
                '/register-an-account',
                {
                  background: getLocation()
                }
              )
            }}
          >
            Register An Account
          </a>

          <a
            className = 'dashboard_section_item'
            href = 'javascript:void(0)'
            onClick = {() => {
              history.push(
                '/logout',
                {
                  background: getLocation()
                }
              )
            }}
          >
            Logout
          </a>
        </div>
      </div>
      
      <div
        className = 'dashboard_children_container'
      >
        {children}
      </div>
    </div>
  )
}

export default DashboardFrame