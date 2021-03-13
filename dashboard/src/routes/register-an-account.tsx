import { useEffect, useState } from 'react'

import { Redirect } from 'react-router-dom'

import { API } from '../helpers/custom-fetch'

type PropsType = {
  isVisible: boolean
}

function RegisterAnAccount(props: PropsType) {
  const [ isNeedToRedirectAt, setIsNeedToRedirectAt ] = useState<'/' | null>()
  const [ username, setUsername ] = useState('')
  const [ password, setPassword ] = useState('')
  const [ confirmPassword, setConfirmPassword ] = useState('')
  const [ isTryingRegister, setIsTryingRegister ] = useState(false)

  useEffect(() => {
    if(window.location.href.includes('/register-an-account') && !props.isVisible) {
      setIsNeedToRedirectAt('/')
    }
  }, [])

  useEffect(() => {
    if(window.location.href.includes('/register-an-account') && props.isVisible) {
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
              onClick = {() => {
                if(!isTryingRegister) {
                  window.history.back()
                }
              }}
            /> 
            
            <div
              className = 'modal-dialog-box-container'
            >
              <h2
                className = 'modal-dialog-box-title'
              >
                Register An Account
              </h2>

              <input
                autoCapitalize = 'none'
                className = 'modal-dialog-box-input'
                onChange = {event => setUsername(event.target.value)}
                placeholder = 'Username'
                value = {username}
              />

              <input
                autoCapitalize = 'none'
                className = 'modal-dialog-box-input'
                onChange = {event => setPassword(event.target.value)}
                placeholder = 'Password'
                type = 'password'
                value = {password}
              />

              <input
                autoCapitalize = 'none'
                className = 'modal-dialog-box-input'
                onChange = {event => setConfirmPassword(event.target.value)}
                placeholder = 'Confirm Password'
                type = 'password'
                value = {confirmPassword}
              />

              <a
                className = 'modal-dialog-box-submit-button'
                href = 'javascript:void(0)'
                onClick = {register}
                style = {{
                  backgroundColor: !isTryingRegister && username.trim() != '' && password != '' && confirmPassword != '' ? 'green' : 'dimgray',
                  marginTop: 20,
                  pointerEvents: !isTryingRegister && username.trim() != '' && password != '' && confirmPassword != '' ? 'auto' : 'none'
                }}
              >
                <div
                  className = 'loader'
                  style = {{
                    display: isTryingRegister ? 'block' : 'none'
                  }}
                />

                Submit
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

  async function register() {
    if(password != confirmPassword) {
      alert('Password dan confirm password tidak sama')

      return
    }

    setIsTryingRegister(true)

    const res = await API.Register({
      username,
      password
    })
    
    setIsTryingRegister(false)

    if(res.JSON) {
      alert(res.JSON['info'])

      if(res.JSON['status'] == 'success') {
        window.location.href = '/'
      }
    } else {
      alert(res.Text || res.error.toString())
    }
  }
}

export default RegisterAnAccount