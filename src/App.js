import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import './styles.css';
import { BrowserRouter as Router, Route, Switch, withRouter } from "react-router-dom";
import HomePage from "./Home/HomePage";
import WebMiner from "./WebMiner/WebMinerPage";
import DownloadPage from "./Download/DownloadPage";
import PageNotFound from "./PageNotFound";
import ScrollToTop from "./ScrollToTop";

function App() {
  require('bootstrap'); //This is for JS things
  const [isAuth, setIsAuth] = useState(false);

  return (<>
    <Router basename={process.env.PUBLIC_URL}>
      <ScrollToTop />
      <Switch>
        {/* WebSite Routes */}
        <Route path="/" exact component={withRouter(HomePage)} />
        <Route path="/webminer" exact component={withRouter(WebMiner)} />
        <Route path="/download" exact component={withRouter(DownloadPage)} />
        <Route path="/download/mac" exact render={withRouter(props => <DownloadPage {...props} OS="Mac OS" />)} />
        <Route path="/download/windows" exact render={withRouter(props => <DownloadPage {...props} OS="Windows" />)} />

      </Switch>
    </Router>
  </>
  );
}

export default App;
