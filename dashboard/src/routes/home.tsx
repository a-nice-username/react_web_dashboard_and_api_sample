import { useEffect, useState } from 'react'

import { Redirect } from 'react-router'
import { format } from 'date-fns'

import DashboardFrame from '../components/dashboard-frame'
import { API } from '../helpers/custom-fetch'
import { validateAccountRoleAccess } from '../helpers/validate-account-role-access'

import { Line } from 'react-chartjs-2'

type GraphDataType = {
  day: string,
  total: number
}

type SummaryType = {
  total_users: number,
  total_pictures: number,
  users_week_graph_data: GraphDataType[]
  pictures_week_graph_data: GraphDataType[]
}

function Home() {
  const [ isAlreadyLogout, setIsAlreadyLogout ] = useState(false)
  const [ summary, setSummary ] = useState<SummaryType>()

  useEffect(() => {
    handleIfNotAlreadyLoggedIn()
  }, [])
  
  return (
    <>
      <DashboardFrame
        onLogout = {() => setIsAlreadyLogout(true)}
        selectedSection = 'dashboard'
      >
        <div
          style = {{
            backgroundColor: 'silver',
            display: 'flex',
            justifyContent: 'space-evenly',
            padding: 20
          }}
        >
          <div
            style = {{
              alignItems: 'center',
              backgroundColor: 'white',
              border: '3px solid lightgray',
              borderRadius: 10,
              color: 'black',
              display: 'flex',
              flexDirection: 'column',
              minHeight: 120,
              justifyContent: 'center',
              minWidth: 120
            }}
          >
            <div
              style = {{
                fontSize: 28,
                fontWeight: 'bold'
              }}
            >
              {summary?.total_users}
            </div>

            <div>
              Users
            </div>
          </div>

          <div
            style = {{
              alignItems: 'center',
              backgroundColor: 'white',
              border: '3px solid lightgray',
              borderRadius: 10,
              color: 'black',
              display: 'flex',
              flexDirection: 'column',
              minHeight: 120,
              justifyContent: 'center',
              marginLeft: 20,
              minWidth: 120
            }}
          >
            <div
              style = {{
                fontSize: 28,
                fontWeight: 'bold'
              }}
            >
              {summary?.total_pictures}
            </div>

            <div>
              Pictures
            </div>
          </div>
        </div>

        <div
          style = {{
            padding: 20
          }}
        >
          <Line
            data = {{
              labels: (summary?.users_week_graph_data || []).map(item => format(new Date(item.day), 'dd MMM')),
              datasets: [
                {
                  label: 'New users over a week',
                  data: (summary?.users_week_graph_data || []).map(item => item.total),
                  fill: false,
                  backgroundColor: 'limegreen',
                  borderColor: 'green',
                },
              ]
            }}
            options = {{
              scales: {
                yAxes: [
                  {
                    ticks: {
                      beginAtZero: true
                    }
                  }
                ]
              }
            }}
          />

          <br />

          <Line
            data = {{
              labels: (summary?.pictures_week_graph_data || []).map(item => format(new Date(item.day), 'dd MMM')),
              datasets: [
                {
                  label: 'Pictures uploaded over a week',
                  data: (summary?.pictures_week_graph_data || []).map(item => item.total),
                  fill: false,
                  backgroundColor: 'violet',
                  borderColor: 'purple',
                },
              ]
            }}
            options = {{
              scales: {
                yAxes: [
                  {
                    ticks: {
                      beginAtZero: true
                    }
                  }
                ]
              }
            }}
          />
        </div>
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
    const res = await API.Summary()

    if(res.JSON) {
      console.log(JSON.stringify(res.JSON['data'], null, 2))

      setSummary(res.JSON['data'])
    } else {
      alert(res.Text || res.error.toString())
    }
  }
}

export default Home