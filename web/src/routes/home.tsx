import { useEffect, useState } from 'react'

import { useLocation, useHistory } from 'react-router-dom'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faBars } from '@fortawesome/free-solid-svg-icons'

import { API, getLocation, setLocation } from '../references'

library.add(faBars)

type PictureType = {
  id: number,
  filename: string,
  title: string,
  url: string,
  created_at: string
}

function Home() {
  setLocation(useLocation())
  const history = useHistory()

  const [ isLoadingPictures, setIsLoadingPictures ] = useState(false)
  const [ pictures, setPictures ] = useState<PictureType[]>([])

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
      </div>
    </>
  )

  function handleIfNotAlreadyLoggedIn() {
    const loginData = localStorage.getItem('LOGIN_DATA')

    if(loginData == null) {
      window.location.href = '/login'

      setLocation(undefined)

      return
    }

    loadPictures()
  }

  function loadPictures() {
    setIsLoadingPictures(true)

    setPictures([])

    const { id } = JSON.parse(localStorage.getItem('LOGIN_DATA')!)
    
    fetch(`${API('/get-pictures')}?id=${id}`)
    .then(res => res.text())
    .then(resText => {
      setIsLoadingPictures(false)

      if(resText[0] == '{') {
        const resJSON = JSON.parse(resText)

        if(resJSON['status'] == 'success') {
          setPictures(resJSON['data'])
        } else {
          alert(resJSON['info'])
        }
      } else {
        console.log(resText)
      }
    })
    .catch(err => {
      setIsLoadingPictures(false)

      console.error(err.toString())
    })
  }

  function logout() {
    setLocation(undefined)

    localStorage.removeItem('LOGIN_DATA')

    window.location.href = '/login'
  }
}

export default Home