import Footer from "./Page/Footer";
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
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/van-details" element={<div>Van Details Page</div>} />
        <Route path="/van-booking" element={<div>Van Booking Page</div>} />
        <Route path="/special-request" element={<div>Special Request Page</div>} />
      </Routes>
      <Footer/>
    </BrowserRouter>
    </>
  )
}

export default App
