import { useEffect, useState } from 'react'

import { API } from '../references'

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
  const [picture, setPicture] = useState<FileType>()
  const [title, setTitle] = useState('')
  const [ isTryingSubmit, setIsTryingSubmit ] = useState(false)

  useEffect(() => {
    if(window.location.href.endsWith('/add-a-picture') && !props.isVisible) {
      window.location.href = '/'
    }
  }, [])

  useEffect(() => {
    if(window.location.href.endsWith('/add-a-picture') && props.isVisible) {
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

  function addAPicture() {
    const { id } = JSON.parse(localStorage.getItem('LOGIN_DATA')!)

    const formData =  new FormData()

    formData.append('owner_id', id)
    formData.append('title', title)
    formData.append('picture', picture!.file)

    setIsTryingSubmit(true)
    
    fetch(
      API('/add-a-picture'),
      {
        method: 'POST',
        headers: {
          Accept: 'application/json'
        },
        body: formData
      }
    )
    .then(res => res.text())
    .then(resText => {
      setIsTryingSubmit(false)

      if(resText[0] == '{') {
        const resJSON = JSON.parse(resText)

        if(resJSON['status'] == 'success') {
          setPicture(undefined)
          setTitle('')
            
          window.location.href = '/'
        } else {
          alert(resJSON['info'])
        }
      } else {
        alert(resText)
      }
    })
    .catch(err => {
      setIsTryingSubmit(false)

      alert(err.toString())
    })
  }
}

export default AddAPicture