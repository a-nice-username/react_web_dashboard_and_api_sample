import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Helmet from 'react-helmet'

import Home from './routes/home'
import Accounts from './routes/accounts'
import Pictures from './routes/pictures'
import RegisterAnAccount from './routes/register-an-account'
import Login from './routes/login'

function Main() {
  return (
    <>
      <Router>
        <Switch>
          <Route
            exact path = '/'
            component = {Home}
          />

          <Route
            path = '/accounts'
            component = {Accounts}
          />

          <Route
            path = '/pictures'
            component = {Pictures}
          />

          <Route
            path = '/register-an-account'
            component = {RegisterAnAccount}
          />

          <Route
            path = '/login'
            component = {Login}
          />
        </Switch>
      </Router>

      <Helmet
        title = 'Dashboard Pictures App'
      />
    </>
  )
}

export default Main