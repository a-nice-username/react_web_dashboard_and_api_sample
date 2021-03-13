import { useEffect, useState } from 'react'

import { Redirect, useHistory } from 'react-router-dom'

import { setLocation } from '../references'

type PropsType = {
  isVisible: boolean
}

function Logout(props: PropsType) {
  const history = useHistory()
  
  const [ isNeedToRedirectAt, setIsNeedToRedirectAt ] = useState<'/' | '/login' | null>()

  useEffect(() => {
    if(window.location.href.includes('/logout') && !props.isVisible) {
      setIsNeedToRedirectAt('/')
    }
  }, [])

  useEffect(() => {
    if(window.location.href.includes('/logout') && props.isVisible) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }
  }, [props.isVisible])
  
  return (
    <>
      {
        props.isVisible ?
          <div
            className = 'modal-container'
          >
            <div
              className = 'modal-background'
              onClick = {() => window.history.back()}
            /> 
            
            <div
              className = 'modal-dialog-box-container'
            >
              <h2
                className = 'modal-dialog-box-title'
              >
                Logout?
              </h2>

              <a
                className = 'modal-dialog-box-submit-button'
                href = 'javascript:void(0)'
                onClick = {() => window.history.back()}
                style = {{
                  backgroundColor: 'green',
                  marginTop: 10
                }}
              >
                Cancel
              </a>

              <a
                className = 'modal-dialog-box-submit-button'
                href = 'javascript:void(0)'
                onClick = {logout}
                style = {{
                  backgroundColor: 'red',
                  marginTop: 10
                }}
              >
                Confirm
              </a>
            </div>
          </div>
          :
          null
      }
      
      {
        isNeedToRedirectAt &&
          <Redirect
            to = {isNeedToRedirectAt}
          />
      }
    </>
  )

  function logout() {
    setLocation(undefined)

    localStorage.removeItem('LOGIN_DATA')
    
    setIsNeedToRedirectAt('/login')
  }
}

export default Logout