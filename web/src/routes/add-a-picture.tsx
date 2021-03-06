import { useEffect, useState } from 'react'

import { Redirect } from 'react-router'

import { API } from '../helpers/custom-fetch'

type FileType = {
  name: string,
  type: string,
  uri: string,
  file: File
}

type PropsType = {
  isVisible: boolean
}

function AddAPicture(props: PropsType) {
  const [ picture, setPicture ] = useState<FileType>()
  const [ title, setTitle ] = useState('')
  const [ isTryingSubmit, setIsTryingSubmit ] = useState(false)
  const [ isNeedToRedirectAt, setIsNeedToRedirectAt ] = useState<'/' | null>()

  useEffect(() => {
    if(window.location.href.includes('/add-a-picture') && !props.isVisible) {
      setIsNeedToRedirectAt('/')
    }
  }, [])

  useEffect(() => {
    if(window.location.href.includes('/add-a-picture') && props.isVisible) {
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
                if(!isTryingSubmit) {
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
                Add A Picture
              </h2>

              <input 
                className = 'add-a-picture-dialog-box-picture-picker'
                type = 'file'
                id = 'picture-picker'
                accept = 'image/png, image/jpeg'
                onChange = {event => {
                  const { currentTarget } = event

                  const file = currentTarget.files![0]
                  const { name, type } = currentTarget.files![0]

                  const uri = URL.createObjectURL(currentTarget.files![0])

                  setPicture({ name, type, uri, file })
                }}
              />

              <a
                className = 'add-a-picture-dialog-box-picture-field-container'
                href = 'javascript:void(0)'
                onClick = {() => document.getElementById('picture-picker')?.click()}
              >
                {
                  picture != undefined ?
                    <img
                      className = 'add-a-picture-dialog-box-picture-field-picture'
                      src = {picture.uri}
                    />
                    :
                    <div
                      className = 'add-a-picture-dialog-box-picture-field-placeholder'
                    >
                      Insert a picture here...
                    </div>
                }
              </a>

              <input
                autoCapitalize = 'sentences'
                className = 'add-a-picture-dialog-box-input'
                onChange = {event => setTitle(event.target.value)}
                placeholder = 'Title'
                value = {title}
              />

              <a
                className = 'modal-dialog-box-submit-button'
                href = 'javascript:void(0)'
                onClick = {addAPicture}
                style = {{
                  backgroundColor: !isTryingSubmit && title.trim() != '' && picture != undefined ? 'green' : 'dimgray',
                  marginTop: 20,
                  pointerEvents: !isTryingSubmit && title.trim() != '' && picture != undefined ? 'auto' : 'none'
                }}
              >
                <div
                  className = 'loader'
                  style = {{
                    display: isTryingSubmit ? 'block' : 'none'
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

  async function addAPicture() {
    const { id } = JSON.parse(localStorage.getItem('LOGIN_DATA')!)

    setIsTryingSubmit(true)

    const res = await API.AddAPicture({
      owner_id: id,
      title,
      picture: picture!.file
    })

    setIsTryingSubmit(false)

    if(res.JSON) {
      if(res.JSON['status'] == 'success') {
        setPicture(undefined)
        setTitle('')
          
        window.location.href = '/'
      } else {
        alert(res.JSON['info'])
      }
    } else {
      alert(res.Text || res.error.toString())
    }
  }
}

export default AddAPicture