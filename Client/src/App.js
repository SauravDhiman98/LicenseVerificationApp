import logo from './logo.svg';
import './App.css';
import VerifyLicense from './Pages/VerificationPage';
import HomePage from './Pages/HomePage'
import {BrowserRouter, Routes, Route} from 'react-router-dom'


function App() {
  return (
    <div className="App">
      <BrowserRouter>
       <Routes>
        <Route exact path='/' element={<HomePage/>}/>
        <Route exact path='/verifylicense' element={<VerifyLicense/>}/>
       </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
