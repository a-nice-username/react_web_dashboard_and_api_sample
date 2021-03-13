import { useEffect, useState } from 'react'

import { useHistory, Redirect } from 'react-router-dom'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faBars } from '@fortawesome/free-solid-svg-icons'

import { getLocation, setLocation } from '../references'
import { API } from '../helpers/custom-fetch'

library.add(faBars)

type PictureType = {
  id: number,
  filename: string,
  title: string,
  url: string,
  created_at: string
}

function Home() {
  const history = useHistory()

  const [ isLoadingPictures, setIsLoadingPictures ] = useState(false)
  const [ pictures, setPictures ] = useState<PictureType[]>([])
  const [ isAlreadyLogout, setIsAlreadyLogout ] = useState(false)

  useEffect(() => {
    handleIfNotAlreadyLoggedIn()
  }, [])
  
  return (
    <>
      <div
        className = 'home-top-nav-container'
      >
        <h2>
          Pictures App
        </h2>

        <div
          className = 'home-top-nav-right-options-container'
        >
          <a
            className = 'home-top-nav-right-option-button'
            href = 'javascript:void(0)'
            onClick = {() => {
              history.push(
                '/add-a-picture',
                {
                  background: getLocation()
                }
              )
            }}
            style = {{
              backgroundColor: 'green'
            }}
          >
            Add A Picture
          </a>

          <a
            className = 'home-top-nav-right-option-button'
            href = 'javascript:void(0)'
            onClick = {logout}
            style = {{
              backgroundColor: 'red'
            }}
          >
            Logout
          </a>

          <a
            className = 'home-top-nav-bar-button'
            href = 'javascript:void(0)'
            onClick = {() => {
              history.push(
                '/options',
                {
                  background: getLocation()
                }
              )
            }}
          >
            <FontAwesomeIcon
              icon = 'bars'
            />
          </a>
        </div>
      </div>
      
      <div
        className = 'home-pictures-container'
      >
        {
          isLoadingPictures ?
            <div
              className = 'home-picture-message'
            >
              <div
                className = 'loader'
              />

              Loading Pictures
            </div>
            :
            (
              pictures.length == 0 ?
                <div
                  className = 'home-picture-message'
                >
                  No Pictures Found
                </div>
                :
                pictures.map(picture => (
                  <div
                    className = 'home-picture-container'
                    key = {picture.id}
                  >
                    <img
                      className = 'home-picture'
                      src = {picture.url}
                    />

                    <div>
                      {picture.title}
                    </div>
                  </div>
                ))
            )
        }

        {
          isAlreadyLogout &&
            <Redirect
              to = '/login'
            />
        }
      </div>
    </>
  )

  async function handleIfNotAlreadyLoggedIn() {
    const loginData = localStorage.getItem('LOGIN_DATA')

    if(loginData == null) {
      setIsAlreadyLogout(true)

      setLocation(undefined)

      return
    }

    const res = await API.CheckIfAccountExist({
      ID: JSON.parse(loginData)['id']
    })
    
    if(res.JSON && res.JSON['status'] == 'not_found') {
      alert('Maaf anda telah keluar dari akun / akun anda telah dihapus')

      logout()
    } else {
      loadPictures()
    }
  }

  async function loadPictures() {
    setPictures([])

    setIsLoadingPictures(true)

    const { id } = JSON.parse(localStorage.getItem('LOGIN_DATA')!)

    const res =  await API.GetPictures({
      id
    })
    
    setIsLoadingPictures(false)

    if(res.JSON) {
      if(res.JSON['status'] == 'success') {
        setPictures(res.JSON['data'])
      } else {
        alert(res.JSON['info'])
      }
    } else {
      console.log(res.Text || res.error.toString())
    }
  }

  function logout() {
    setLocation(undefined)

    localStorage.removeItem('LOGIN_DATA')

    setIsAlreadyLogout(true)
  }
}

export default Home