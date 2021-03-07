import { useEffect, useState } from 'react'

import { Redirect } from 'react-router'
import { format } from 'date-fns'

import DashboardFrame from '../components/dashboard-frame'
import AccountListItem from '../components/account-list-item'
import { API } from '../helpers/custom-fetch'

type AccountType = {
  id: number,
  username: string,
  created_at: string,
  role: string
}

function Administrators() {
  const [ accounts, setAccounts ] = useState<AccountType[]>([])
  const [ selectedIDs, setSelectedIDs] = useState<number[]>([])
  const [ isAlreadyLogout, setIsAlreadyLogout ] = useState(false)

  useEffect(() => {
    handleIfNotAlreadyLoggedIn()
  }, [])
  
  return (
    <>
      <DashboardFrame
        onLogout = {() => setIsAlreadyLogout(true)}
        selectedSection = 'administrators'
      >
        <AccountListItem
          isTheMainRow
          id = 'ID'
          isChecked = {selectedIDs.length == accounts.length}
          username = 'Username'
          role = 'Role'
          created_at = 'Created At'
          onIsCheckedChange = {() => {
            if(selectedIDs.length == accounts.length) {
              setSelectedIDs([])
            } else {
              setSelectedIDs(accounts.map(account => account.id))
            }
          }}
        />
        
        {
          accounts.map(account => (
            <AccountListItem
              id = {String(account.id)}
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
              created_at = {format(new Date(account.created_at), 'dd MMMM yyyy, hh:mm')}
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

    loadData()
  }

  async function loadData() {
    const res = await API.GetAdministrators()

    if(res.JSON) {
      setAccounts(res.JSON['data'])
    } else {
      console.log(res.Text || res.error.toString())
    }
  }
}

export default Administrators