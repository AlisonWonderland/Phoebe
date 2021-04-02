import './App.css';
import Home from './components/Home'
import TextGrabber from './components/TextGrabber'
import NotFound from './components/NotFound';

import {
    BrowserRouter as Router,
    Switch,
    Route
} from 'react-router-dom'

function App() {
    return (
        <div className="App">
            <Router>
                <Switch>
                    <Route exact path="/scan">
                        <TextGrabber />
                    </Route>
                    <Route exact path="/">
                        <Home />
                    </Route>
                    <Route>
                        <NotFound />
                    </Route>
                </Switch>
            </Router>
        </div>
    );
}

export default App;
