import { ReactNode } from 'react'

import { useHistory } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faChartLine, faUser, faUserTie, faImages, faUserPlus, faSignOutAlt } from '@fortawesome/free-solid-svg-icons'

import { getLocation } from '../references'

library.add(faChartLine, faUser, faUserTie, faImages, faUserPlus, faSignOutAlt)

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

          <a
            className = {selectedSection == 'dashboard' ? 'dashboard_section_selected_item' : 'dashboard_section_item'}
            href = '/'
          >
            <div
              className = 'dashboard_section_item_icon'
            >
              <FontAwesomeIcon
                icon = 'chart-line'
              />
            </div>

            <div
              className = 'dashboard_section_item_text'
            >
              Dashboard
            </div>
          </a>

          <a
            className = {selectedSection == 'users' ? 'dashboard_section_selected_item' : 'dashboard_section_item'}
            href = '/users'
          >
            <div
              className = 'dashboard_section_item_icon'
            >
              <FontAwesomeIcon
                icon = 'user'
              />
            </div>

            <div
              className = 'dashboard_section_item_text'
            >
              Users
            </div>
          </a>

          <a
            className = {selectedSection == 'administrators' ? 'dashboard_section_selected_item' : 'dashboard_section_item'}
            href = '/administrators'
          >
            <div
              className = 'dashboard_section_item_icon'
            >
              <FontAwesomeIcon
                icon = 'user-tie'
              />
            </div>

            <div
              className = 'dashboard_section_item_text'
            >
              Administrators
            </div>
          </a>

          <a
            className = {selectedSection == 'pictures' ? 'dashboard_section_selected_item' : 'dashboard_section_item'}
            href = '/pictures'
          >
            <div
              className = 'dashboard_section_item_icon'
            >
              <FontAwesomeIcon
                icon = 'images'
              />
            </div>

            <div
              className = 'dashboard_section_item_text'
            >
              Pictures
            </div>
          </a>

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
            <div
              className = 'dashboard_section_item_icon'
            >
              <FontAwesomeIcon
                icon = 'user-plus'
              />
            </div>

            <div
              className = 'dashboard_section_item_text'
            >
              Register An Account
            </div>
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
            <div
              className = 'dashboard_section_item_icon'
            >
              <FontAwesomeIcon
                icon = 'sign-out-alt'
              />
            </div>

            <div
              className = 'dashboard_section_item_text'
            >
              Logout
            </div>
          </a>
        </div>
      </div>
      
      <div
        className = 'dashboard_children_container'
      >
        <h2
          className = 'dashboard_mobile_title'
        >
          Pictures App
        </h2>
        
        {children}
      </div>
    </div>
  )
}

export default DashboardFrame