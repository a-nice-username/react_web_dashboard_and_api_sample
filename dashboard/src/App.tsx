import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Helmet from 'react-helmet'

import Home from './routes/home'
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