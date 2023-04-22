import logo from './logo.svg';
import './App.css';
import VerifyLicense from './Pages/VerificationPage';
import HomePage from './Pages/HomePage'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import GetUserdetails from './Pages/GetUserDetails';
import GetAccountDetails from "./Pages/GetAccountDetails"


function App() {
  return (
    <div className="App">
      <BrowserRouter>
       <Routes>
        <Route exact path='/' element={<HomePage/>}/>
        <Route exact path='/verifylicense' element={<VerifyLicense/>}/>
        <Route exact path='/getuserdetail' element={<GetUserdetails/>}/>
        <Route exact path='/getaccountdetails' element={<GetAccountDetails/>}/>
       </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
