import { useEffect, useState } from 'react'

import { Link } from 'react-router-dom'

import { API } from '../references'

function Register() {
  const [ username, setUsername ] = useState('')
  const [ password, setPassword ] = useState('')
  const [ confirmPassword, setConfirmPassword ] = useState('')
  const [ isTryingRegister, setIsTryingRegister ] = useState(false)

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
    </div>
  )
  
  function handleIfAlreadyLoggedIn() {
    const loginData = localStorage.getItem('LOGIN_DATA')

    if(loginData != null) {
      window.location.href = '/'
    }
  }

  function register() {
    if(password != confirmPassword) {
      alert('Password dan confirm password tidak sama')

      return
    }

    setIsTryingRegister(true)

    fetch(
      API('/register'),
      {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password
        })
      }
    )
    .then(res => res.text())
    .then(resText => {
      setIsTryingRegister(false)

      if(resText[0] == '{') {
        const resJSON = JSON.parse(resText)

        alert(resJSON['info'])

        if(resJSON['status'] == 'success') {
          window.location.href = '/login'
        }
      } else {
        alert(resText)
      }
    })
    .catch(err => {
      setIsTryingRegister(false)

      alert(err.toString())
    })
  }
}

export default Register