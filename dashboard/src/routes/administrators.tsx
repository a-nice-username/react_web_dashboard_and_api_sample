import { useEffect, useState } from 'react'

import { Redirect } from 'react-router'
import { format } from 'date-fns'

import DashboardFrame from '../components/dashboard-frame'
import AccountListItem from '../components/account-list-item'
import { API } from '../helpers/custom-fetch'
import { validateAccountRoleAccess } from '../helpers/validate-account-role-access'

type AccountType = {
  id: number,
  username: string,
  created_at: string,
  role: string
}

type LoginDataType = {
  id: number,
  username: string,
  created_at: string,
  role: string
}

function Administrators() {
  const [ selectedBulkOption, setSelectedBulkOption ] = useState<'Select an option' | 'Remove from admin list' | 'Delete accounts'>('Select an option')
  const [ accounts, setAccounts ] = useState<AccountType[]>([])
  const [ selectedIDs, setSelectedIDs] = useState<number[]>([])
  const [ isAlreadyLogout, setIsAlreadyLogout ] = useState(false)
  const [ loginData, setLoginData ] = useState<LoginDataType>()

  useEffect(() => {
    handleIfNotAlreadyLoggedIn()
  }, [])
  
  return (
    <>
      <DashboardFrame
        onLogout = {() => setIsAlreadyLogout(true)}
        selectedSection = 'administrators'
      >
        {
          loginData && loginData.role == 'superuser' &&
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
                  value = 'Remove from admin list'
                >
                  Remove from admin list
                </option>

                <option
                  value = 'Delete accounts'
                >
                  Delete accounts
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
        }

        <AccountListItem
          isTheMainRow
          id = 'ID'
          isHideCheckBox = {loginData == undefined || loginData.role == 'administrator' || accounts.filter(account => account.role != 'superuser').length == 0}
          isChecked = {selectedIDs.length == accounts.filter(account => account.role != 'superuser').length}
          username = 'Username'
          role = 'Role'
          created_at = 'Created At'
          onIsCheckedChange = {() => {
            if(selectedIDs.length == accounts.filter(account => account.role != 'superuser').length) {
              setSelectedIDs([])
            } else {
              setSelectedIDs(accounts.filter(account => account.role != 'superuser').map(account => account.id))
            }
          }}
        />
        
        {
          accounts.map(account => (
            <AccountListItem
              id = {String(account.id)}
              isHideCheckBox = {loginData == undefined || loginData.role == 'administrator' || account.role == 'superuser'}
              isChecked = {selectedIDs.includes(account.id)}
              onIsCheckedChange = {() => {
                const newSelectedIDs = JSON.parse(JSON.stringify(selectedIDs)) as number[]

                if(newSelectedIDs.includes(account.id)) {
                  newSelectedIDs.splice(newSelectedIDs.indexOf(account.id), 1)
                } else {
                  newSelectedIDs.push(account.id)
                }
                
                setSelectedIDs(newSelectedIDs)
              }}
              username = {account.username}
              role = {account.role}
              created_at = {format(new Date(account.created_at), 'dd MMMM yyyy, HH:mm')}
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
        setLoginData(JSON.parse(loginData))
    
        loadData()
      },
      () => setIsAlreadyLogout(true)
    )
  }

  async function loadData() {
    const res = await API.GetAdministrators()

    if(res.JSON) {
      setAccounts(res.JSON['data'])
    } else {
      console.log(res.Text || res.error.toString())
    }
  }

  async function applyDropdown() {
    let IDs = ''

    for(const ID of selectedIDs) {
      IDs += `${String(ID)} `
    }

    IDs = IDs.trim().replace(/ /g, ', ')

    if(selectedBulkOption == 'Remove from admin list') {
      const res = await API.ChangeAccountsRole({
        IDs,
        role: 'user'
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
    } else if(selectedBulkOption == 'Delete accounts'){
      const res = await API.DeleteAccounts({
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

export default Administrators