import { useEffect, useState } from 'react'

import { Link } from 'react-router-dom'

import { API } from '../references'

function Login() {
  const [ username, setUsername ] = useState('')
  const [ password, setPassword ] = useState('')
  const [ isTryingLogin, setIsTryingLogin ] = useState(false)

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
          Pictures App
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

        <a
          className = 'dialog-box-submit-button'
          href="javascript:void(0)"
          onClick = {login}
          style = {{
            backgroundColor: !isTryingLogin && username.trim() != '' && password != '' ? 'green' : 'dimgray',
            pointerEvents: !isTryingLogin && username.trim() != '' && password != '' ? 'auto' : 'none'
          }}
        >
          <div
            className = 'loader'
            style = {{
              display: isTryingLogin ? 'block' : 'none'
            }}
          />

          Login
        </a>
      </div>

      <div
        className = 'question-line'
      >
        {"Don't have an account? "}

        <Link
          to = '/register'
        >
          Register
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

  function login() {
    setIsTryingLogin(true)

    fetch(
      API('/login'),
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
      setIsTryingLogin(false)

      if(resText[0] == '{') {
        const resJSON = JSON.parse(resText)

        if(resJSON['status'] == 'success') {
          localStorage.setItem('LOGIN_DATA', JSON.stringify(resJSON['data']))

          window.location.href = '/'
        } else {
          alert(resJSON['info'])
        }
      } else {
        alert(resText)
      }
    })
    .catch(err => {
      setIsTryingLogin(false)

      alert(err.toString())
    })
  }
}

export default Login