import React from 'react'

import Helmet from 'react-helmet'
import { BrowserRouter as Router, Route, Switch, useLocation } from 'react-router-dom'

import Login from './routes/login'

function Main() {
  return (
    <Router>
      <Switch>
        <Route
          path = '/login'
        >
          <Helmet
            title = 'Dashboard | Login'
          />

          <Login />
        </Route>
      </Switch>
    </Router>
  )
}

export default Main