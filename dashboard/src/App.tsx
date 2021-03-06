import Helmet from 'react-helmet'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

import Home from './routes/home'
import Login from './routes/login'

function Main() {
  return (
    <Router>
      <Switch>
        <Route
          exact path = '/'
        >
          <Helmet
            title = 'Dashboard | Home'
          />

          <Home />
        </Route>

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