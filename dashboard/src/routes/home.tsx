import { useEffect } from 'react'

function Home() {
  useEffect(() => {
    handleIfNotAlreadyLoggedIn()
  }, [])
  
  return (
    <div
      className = 'container'
    >
      <h2
        style = {{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          marginLeft: 5,
          marginRight: 5,
          textAlign: 'center'
        }}
      >
        Pictures App
        
        <div
          style = {{
            color: 'deepskyblue',
            marginLeft: 5,
            marginRight: 5
          }}
        >
          {'| Admin'}
        </div>
      </h2>

      <a
        href = 'javascript:void(0)'
        onClick = {logout}
        style = {{
          marginTop: 20,
          textDecorationLine: 'none'
        }}
      >
        Logout
      </a>
    </div>
  )

  function handleIfNotAlreadyLoggedIn() {
    const loginData = localStorage.getItem('LOGIN_DATA')

    if(loginData == null) {
      window.location.href = '/login'

      return
    }
  }

  function logout() {
    localStorage.removeItem('LOGIN_DATA')

    window.location.href = '/login'
  }
}

export default Home