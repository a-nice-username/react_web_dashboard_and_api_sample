import { BrowserRouter as Router, Route, Switch, useLocation } from 'react-router-dom'
import Helmet from 'react-helmet'
import { Location } from 'history'

import Home from './routes/home'
import Users from './routes/users'
import Administrators from './routes/administrators'
import Pictures from './routes/pictures'
import RegisterAnAccount from './routes/register-an-account'
import Logout from './routes/logout'
import Login from './routes/login'
import { setLocation } from './references'

type LocationStateType = {
  background?: Location
}

function Main() {
  return (
    <>
      <Router>
        <RouterContent />
      </Router>

      <Helmet
        title = 'Dashboard Pictures App'
      />
    </>
  )
}

function RouterContent() {
  const location = useLocation<LocationStateType>()
  
  setLocation(location)
  
  const background = location.state && location.state.background

  return (
    <>
      <Switch
        location = {background || location}
      >
        <Route
          exact path = '/'
          component = {Home}
        />

        <Route
          path = '/users'
          component = {Users}
        />

        <Route
          path = '/administrators'
          component = {Administrators}
        />

        <Route
          path = '/pictures'
          component = {Pictures}
        />

        <Route
          path = '/login'
          component = {Login}
        />
      </Switch>

      <RegisterAnAccount
        isVisible = {background != undefined && location.pathname == '/register-an-account'}
      />

      <Logout
        isVisible = {background != undefined && location.pathname == '/logout'}
      />
    </>
  )
}

export default Main