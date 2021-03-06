import { useEffect, useState } from 'react'

import { Link, Redirect } from 'react-router-dom'

import { API } from '../helpers/custom-fetch'

function Login() {
  const [ username, setUsername ] = useState('')
  const [ password, setPassword ] = useState('')
  const [ isTryingLogin, setIsTryingLogin ] = useState(false)
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

  async function login() {
    setIsTryingLogin(true)

    const res = await API.Login({
      username,
      password
    })
    
    setIsTryingLogin(false)
      
    if(res.JSON) {
      if(res.JSON['status'] == 'success') {
        localStorage.setItem('LOGIN_DATA', JSON.stringify(res.JSON['data']))
        
        setIsAlreadyLogin(true)
      } else {
        alert(res.JSON['info'])
      }
    } else {
      alert(res.Text || res.error.toString())
    }
  }
}

export default Login