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

function Users() {
  const [ accounts, setAccounts ] = useState<AccountType[]>([])
  const [ isAlreadyLogout, setIsAlreadyLogout ] = useState(false)

  useEffect(() => {
    handleIfNotAlreadyLoggedIn()
  }, [])
  
  return (
    <>
      <DashboardFrame
        onLogout = {() => setIsAlreadyLogout(true)}
        selectedSection = 'users'
      >
        <AccountListItem
          isTheMainRow
          id = 'ID'
          username = 'Username'
          role = 'Role'
          created_at = 'Created At'
        />
        
        {
          accounts.map(account => (
            <AccountListItem
              id = {String(account.id)}
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
    const res = await API.GetUsers()

    if(res.JSON) {
      setAccounts(res.JSON['data'])
    } else {
      console.log(res.Text || res.error.toString())
    }
  }
}

export default Users