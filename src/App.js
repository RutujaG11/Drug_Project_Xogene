
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DrugSearch from './components/DrugSearch';
import DrugDetails from './components/DrugDetails';



function App() {
  return (
    <Router>
    <div className="app-container">
      <header>
        <h1>Xogene Logo</h1>
      </header>
      <Routes>
        <Route path="/drugs/search" element={<DrugSearch/>}/>
        <Route path="/drugs/:drug_name" element={<DrugDetails/>}/>
        
      </Routes>
    </div>
    </Router>
  );
}

export default App;
