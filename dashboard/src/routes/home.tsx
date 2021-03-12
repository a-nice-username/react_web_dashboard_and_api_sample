import { useEffect, useState } from 'react'

import { Redirect } from 'react-router'
import { useLocation } from 'react-router-dom'
import { format } from 'date-fns'
import { Line } from 'react-chartjs-2'

import DashboardFrame from '../components/dashboard-frame'
import { API } from '../helpers/custom-fetch'
import { setLocation } from '../references'
import { validateAccountRoleAccess } from '../helpers/validate-account-role-access'

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
  setLocation(useLocation())

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
          className = 'dashboard_main_panel_container'
        >
          <div
            className = 'dashboard_main_panel_item_container'
          >
            <div
              className = 'dashboard_main_panel_number'
            >
              {summary?.total_users}
            </div>

            <div>
              Users
            </div>
          </div>

          <div
            className = 'dashboard_main_panel_item_container'
            style = {{
              marginLeft: 20
            }}
          >
            <div
              className = 'dashboard_main_panel_number'
            >
              {summary?.total_pictures}
            </div>

            <div>
              Pictures
            </div>
          </div>
        </div>

        <div
          className = 'dashboard_content_container'
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
                  borderColor: 'green'
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
                  borderColor: 'purple'
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