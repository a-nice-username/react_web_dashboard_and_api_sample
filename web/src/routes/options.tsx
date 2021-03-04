import { useEffect } from 'react'

import { useHistory } from 'react-router-dom'
import { getLocation, setLocation } from '../references'

type PropsType = {
  isVisible: boolean
}

function Options(props: PropsType) {
  const history = useHistory()

  useEffect(() => {
    if(window.location.href.endsWith('/options') && !props.isVisible) {
      window.location.href = '/'
    }
  }, [])

  useEffect(() => {
    if(window.location.href.endsWith('/options') && props.isVisible) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }
  }, [props.isVisible])
  
  return props.isVisible ?
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

  function logout() {
    setLocation(undefined)

    localStorage.removeItem('LOGIN_DATA')

    window.location.href = '/login'
  }
}

export default Options