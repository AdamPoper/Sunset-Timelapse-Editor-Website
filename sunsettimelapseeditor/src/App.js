import MainContent from "./components/MainContent.js";
import Nav from './components/Nav.js';
import AppInfoPage from "./components/AppInfoPage.js";
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';

function App() {
  return (
    <Router>
      <div>
        <Switch>
          <Route path="/" exact component={MainContent}/>
          <Route path="/home" component={MainContent}/>
          <Route path="/appinfo" component={AppInfoPage}/>
        </Switch>        
      </div>
    </Router>

  );
}

export default App;