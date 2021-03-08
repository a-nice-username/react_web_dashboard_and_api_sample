import { useEffect, useState } from 'react'

import { Redirect } from 'react-router'

import DashboardFrame from '../components/dashboard-frame'
import { validateAccountRoleAccess } from '../helpers/validate-account-role-access'

function Pictures() {
  const [ isAlreadyLogout, setIsAlreadyLogout ] = useState(false)

  useEffect(() => {
    handleIfNotAlreadyLoggedIn()
  }, [])
  
  return (
    <>
      <DashboardFrame
        onLogout = {() => setIsAlreadyLogout(true)}
        selectedSection = 'pictures'
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

export default Pictures