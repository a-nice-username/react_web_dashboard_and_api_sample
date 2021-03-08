import { useEffect, useState } from 'react'

import { Redirect } from 'react-router'

import DashboardFrame from '../components/dashboard-frame'
import { validateAccountRoleAccess } from '../helpers/validate-account-role-access'

function Home() {
  const [ isAlreadyLogout, setIsAlreadyLogout ] = useState(false)

  useEffect(() => {
    handleIfNotAlreadyLoggedIn()
  }, [])
  
  return (
    <>
      <DashboardFrame
        onLogout = {() => setIsAlreadyLogout(true)}
        selectedSection = 'dashboard'
      >
        
      </DashboardFrame>

      {
        isAlreadyLogout &&
          <Redirect
            to = '/login'
          />
      }
    </>
  )

  function handleIfNotAlreadyLoggedIn() {
    const loginData = localStorage.getItem('LOGIN_DATA')

    if(loginData == null) {
      setIsAlreadyLogout(true)

      return
    }

    validateAccountRoleAccess(
      JSON.parse(loginData)['id'],
      () => {},
      () => setIsAlreadyLogout(true)
    )
  }
}

export default Home