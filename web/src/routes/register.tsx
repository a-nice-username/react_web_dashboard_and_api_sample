import { useEffect, useState } from 'react'

import { Link, Redirect } from 'react-router-dom'

import { API } from '../helpers/custom-fetch'

function Register() {
  const [ username, setUsername ] = useState('')
  const [ password, setPassword ] = useState('')
  const [ confirmPassword, setConfirmPassword ] = useState('')
  const [ isTryingRegister, setIsTryingRegister ] = useState(false)
  const [ isAlreadyLogin, setIsAlreadyLogin ] = useState(false)

  useEffect(() => {
    handleIfAlreadyLoggedIn()
  }, [])

  return (
    <div
      className = 'container'
    >
      <div
        className = 'dialog-box-container'
      >
        <h2
          className = 'dialog-box-title'
        >
          Register
        </h2>

        <input
          className = 'dialog-box-input'
          onChange = {event => setUsername(event.target.value)}
          placeholder = 'Username'
          value = {username}
        />

        <input
          className = 'dialog-box-input'
          onChange = {event => setPassword(event.target.value)}
          placeholder = 'Password'
          type = 'password'
          value = {password}
        />

        <input
          className = 'dialog-box-input'
          onChange = {event => setConfirmPassword(event.target.value)}
          placeholder = 'Confirm Password'
          type = 'password'
          value = {confirmPassword}
        />

        <a
          className = 'dialog-box-submit-button'
          href="javascript:void(0)"
          onClick = {register}
          style = {{
            backgroundColor: !isTryingRegister && username.trim() != '' && password != '' && confirmPassword != '' ? 'green' : 'dimgray',
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

      <div
        className = 'question-line'
      >
        {"Already have an account? "}

        <Link
          to = '/login'
        >
          Login
        </Link>
      </div>

      {
        isAlreadyLogin &&
          <Redirect
            to = '/'
          />
      }
    </div>
  )
  
  function handleIfAlreadyLoggedIn() {
    const loginData = localStorage.getItem('LOGIN_DATA')

    if(loginData != null) {
      setIsAlreadyLogin(true)
    }
  }

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
        window.location.href = '/login'
      }
    } else {
      alert(res.Text || res.error.toString())
    }
  }
}

export default Register