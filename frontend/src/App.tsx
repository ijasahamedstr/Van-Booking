import Header from "./Page/header"
import Home from "./Page/Home";
import Topbar from "./Page/Topbar"
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {

  return (
    <>
      <BrowserRouter>
      <Topbar/>
      <Header/>
      <Home/>
      <Routes>
        <Route path="/van-details" element={<div>Van Details Page</div>} />
        <Route path="/van-booking" element={<div>Van Booking Page</div>} />
        <Route path="/special-request" element={<div>Special Request Page</div>} />
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
