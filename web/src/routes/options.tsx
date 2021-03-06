import { useEffect, useState } from 'react'

import { Redirect, useHistory } from 'react-router-dom'

import { getLocation, setLocation } from '../references'

type PropsType = {
  isVisible: boolean
}

function Options(props: PropsType) {
  const history = useHistory()
  
  const [ isNeedToRedirectAt, setIsNeedToRedirectAt ] = useState<'/' | '/login' | null>()

  useEffect(() => {
    if(window.location.href.includes('/options') && !props.isVisible) {
      setIsNeedToRedirectAt('/')
    }
  }, [])

  useEffect(() => {
    if(window.location.href.includes('/options') && props.isVisible) {
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
                Options
              </h2>

              <a
                className = 'modal-dialog-box-submit-button'
                href = 'javascript:void(0)'
                onClick = {() => {
                  window.history.back()

                  setTimeout(() => {
                    history.push(
                      '/add-a-picture',
                      {
                        background: getLocation()
                      }
                    )
                  }, 50)
                }}
                style = {{
                  backgroundColor: 'green',
                  marginTop: 10
                }}
              >
                Add A Picture
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
                Logout
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

export default Options