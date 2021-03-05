import Helmet from 'react-helmet'
import { BrowserRouter as Router, Route, Switch, useLocation } from 'react-router-dom'
import { Location } from 'history'

import Login from './routes/login'
import Register from './routes/register'
import Home from './routes/home'
import Options from './routes/options'
import AddPicture from './routes/add-a-picture'

type LocationStateType = {
  background?: Location
}

function Main() {
  return (
    <Router>
      <RouterContent />
    </Router>
  )
}

function RouterContent() {
  const location = useLocation<LocationStateType>()
  
  const background = location.state && location.state.background

  return (
    <>
      <Switch
        location = {background || location}
      >
        <Route
          exact path = '/'
        >
          <Helmet
            title = 'Home'
          />

          <Home />
        </Route>

        <Route
          path = '/login'
        >
          <Helmet
            title = 'Login'
          />

          <Login />
        </Route>

        <Route
          path = '/register'
        >
          <Helmet
            title = 'Register'
          />

          <Register />
        </Route>
      </Switch>

      <AddPicture
        isVisible = {background != undefined && location.pathname == '/add-a-picture'}
      />

      <Options
        isVisible = {background != undefined && location.pathname == '/options'}
      />
    </>
  )
}

export default Main