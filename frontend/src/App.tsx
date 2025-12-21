import Footer from "./Page/Footer";
import Header from "./Page/header"
import Home from "./Page/Home";
import Topbar from "./Page/Topbar"
import { BrowserRouter, Routes, Route } from "react-router-dom";
import VanCards from "./Page/All-Van-Details ";
import Specialrequest from "./Page/Specialrequest";
import VanDetails from "./Page/VanDetails";
import BookingForm from "./Page/BookingForm";

function App() {

  return (
    <>
      <BrowserRouter>
      <Topbar/>
      <Header/>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/van-details" element={<VanCards/>} />
        <Route path="/van-booking" element={<BookingForm/>} />
        <Route path="/van-booking" element={<div>Van Booking Page</div>} />
        <Route path="/special-request" element={<Specialrequest/>} />
        <Route path="/van/:id" element={<VanDetails />} />
      </Routes>
      <Footer/>
    </BrowserRouter>
    </>
  )
}

export default App
