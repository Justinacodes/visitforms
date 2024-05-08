
import "bootstrap/dist/css/bootstrap.min.css";
import FormFloatingBasicExample from './components/VisitorsForm'
import "../src/App.css"
import Homepage from "./pages/Homepage";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";


function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route exact path="/"
            element={<Homepage />} />
          <Route path="/visitorsform" element={<FormFloatingBasicExample />} />
        </Routes>
      </Router>

      {/* <FormFloatingBasicExample />
      <Homepage /> */}
    </>
  )
}

export default App
