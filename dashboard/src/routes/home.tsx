import { useEffect, useState } from 'react'

import { Redirect } from 'react-router'

function Home() {
  const [ selectedSection, setSelectedSection ] = useState<'dashboard' | 'accounts' | 'pictures' | 'registerAnAccount'>('dashboard')
  const [ isAlreadyLogout, setIsAlreadyLogout ] = useState(false)

  useEffect(() => {
    handleIfNotAlreadyLoggedIn()
  }, [])
  
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
            href = 'javascript:void(0)'
            onClick = {() => setSelectedSection('dashboard')}
          >
            Dashboard
          </a>

          <a
            className = {selectedSection == 'accounts' ? 'dashboard_section_selected_item' : 'dashboard_section_item'}
            href = 'javascript:void(0)'
            onClick = {() => setSelectedSection('accounts')}
          >
            Accounts
          </a>

          <a
            className = {selectedSection == 'pictures' ? 'dashboard_section_selected_item' : 'dashboard_section_item'}
            href = 'javascript:void(0)'
            onClick = {() => setSelectedSection('pictures')}
          >
            Pictures
          </a>

          <div
            className = 'dashboard_section'
          >
            OTHER
          </div>

          <a
            className = {selectedSection == 'registerAnAccount' ? 'dashboard_section_selected_item' : 'dashboard_section_item'}
            href = 'javascript:void(0)'
            onClick = {() => setSelectedSection('registerAnAccount')}
          >
            Register An Account
          </a>

          <a
            className = 'dashboard_section_item'
            href = 'javascript:void(0)'
            onClick = {logout}
          >
            Logout
          </a>
        </div>
      </div>

      {
        isAlreadyLogout &&
          <Redirect
            to = '/login'
          />
      }
    </div>
  )

  function handleIfNotAlreadyLoggedIn() {
    const loginData = localStorage.getItem('LOGIN_DATA')

    if(loginData == null) {
      setIsAlreadyLogout(true)

      return
    }
  }

  function logout() {
    localStorage.removeItem('LOGIN_DATA')

    setIsAlreadyLogout(true)
  }
}

export default Home