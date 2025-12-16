import Footer from "./Page/Footer";
import Header from "./Page/header"
import Home from "./Page/Home";
import Topbar from "./Page/Topbar"
import { BrowserRouter, Routes, Route } from "react-router-dom";
import VanCards from "./Page/All-Van-Details ";
import Specialrequest from "./Page/Specialrequest";

function App() {

  return (
    <>
      <BrowserRouter>
      <Topbar/>
      <Header/>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/van-details" element={<VanCards/>} />
        <Route path="/van-booking" element={<div>Van Booking Page</div>} />
        <Route path="/special-request" element={<Specialrequest/>} />
      </Routes>
      <Footer/>
    </BrowserRouter>
    </>
  )
}

export default App
