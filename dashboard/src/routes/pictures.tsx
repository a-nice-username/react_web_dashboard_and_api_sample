import { useEffect, useState } from 'react'

import { Redirect } from 'react-router'
import { format } from 'date-fns'

import DashboardFrame from '../components/dashboard-frame'
import { API } from '../helpers/custom-fetch'
import PictureListItem from '../components/picture-list-item'
import { validateAccountRoleAccess } from '../helpers/validate-account-role-access'

type PictureType = {
  id: number,
  owner_id: number,
  title: string,
  url: string,
  created_at: string
}

function Pictures() {
  const [ selectedBulkOption, setSelectedBulkOption ] = useState<'Select an option' | 'Delete pictures'>('Select an option')
  const [ pictures, setPictures ] = useState<PictureType[]>([])
  const [ selectedIDs, setSelectedIDs] = useState<number[]>([])
  const [ isAlreadyLogout, setIsAlreadyLogout ] = useState(false)

  useEffect(() => {
    handleIfNotAlreadyLoggedIn()
  }, [])
  
  return (
    <>
      <DashboardFrame
        onLogout = {() => setIsAlreadyLogout(true)}
        selectedSection = 'pictures'
      >
        <div
          className = 'dashboard_top_navigation'
        >
          <select
            className = 'dashboard_dropdown'
            disabled = {selectedIDs.length == 0}
            onChange = {event => setSelectedBulkOption(event.target.value as any)}
            value = {selectedBulkOption}
          >
            <option
              value = 'Select an option'
            >
              Select an option
            </option>

            <option
              value = 'Delete pictures'
            >
              Delete pictures
            </option>
          </select>

          <a
            className = 'dashboard_dropdown_apply_button'
            href = 'javascript:void(0)'
            onClick = {applyDropdown}
            style = {{
              backgroundColor: selectedIDs.length == 0 || selectedBulkOption == 'Select an option' ? 'gray' : 'green',
              pointerEvents: selectedIDs.length == 0 || selectedBulkOption == 'Select an option' ? 'none' : 'auto',
            }}
          >
            Apply
          </a>
        </div>

        <PictureListItem
          isTheMainRow
          id = 'ID'
          isHideCheckBox = {pictures.length == 0}
          isChecked = {selectedIDs.length == pictures.length}
          owner_id = 'Owner ID'
          url = 'Picture'
          created_at = 'Created At'
          title = 'Title'
          onIsCheckedChange = {() => {
            if(selectedIDs.length == pictures.length) {
              setSelectedIDs([])
            } else {
              setSelectedIDs(pictures.map(picture => picture.id))
            }
          }}
        />

        {
          pictures.map(picture => (
            <PictureListItem
              id = {String(picture.id)}
              isHideCheckBox = {false}
              isChecked = {selectedIDs.includes(picture.id)}
              onIsCheckedChange = {() => {
                const newSelectedIDs = JSON.parse(JSON.stringify(selectedIDs)) as number[]

                if(newSelectedIDs.includes(picture.id)) {
                  newSelectedIDs.splice(newSelectedIDs.indexOf(picture.id), 1)
                } else {
                  newSelectedIDs.push(picture.id)
                }
                
                setSelectedIDs(newSelectedIDs)
              }}
              owner_id = {String(picture.owner_id)}
              title = {picture.title}
              url = {picture.url}
              created_at = {format(new Date(picture.created_at), 'dd MMMM yyyy, hh:mm')}
            />
          ))
        }
      </DashboardFrame>

      {
        isAlreadyLogout &&
          <Redirect
            to = '/login'
          />
      }
    </>
  )

  function handleIfNotAlreadyLoggedIn() {
    const loginData = localStorage.getItem('LOGIN_DATA')

    if(loginData == null) {
      setIsAlreadyLogout(true)

      return
    }

    validateAccountRoleAccess(
      JSON.parse(loginData)['id'],
      () => {
        loadData()
      },
      () => setIsAlreadyLogout(true)
    )
  }

  async function loadData() {
    const res = await API.GetAllPictures()

    if (res.JSON) {
      setPictures(res.JSON['data'])
    } else {
      alert(res.Text || res.error.toString())
    }
  }

  async function applyDropdown() {
    let IDs = ''

    for(const ID of selectedIDs) {
      IDs += `${String(ID)} `
    }

    IDs = IDs.trim().replace(/ /g, ',')

    if(selectedBulkOption == 'Delete pictures') {
      const res = await API.DeletePictures({
        IDs
      })

      if(res.JSON) {
        if(res.JSON['status'] == 'success') {
          setSelectedBulkOption('Select an option') 
          setSelectedIDs([])
        }

        alert(res.JSON['info'])

        window.location.reload()
      } else {
        alert(res.Text || res.error.toString())
      }
    }
  }
}

export default Pictures