import Navbar from '../Components/Navbar/Navbar'
import Footer from '../Components/Footer/Footer'
import { Outlet } from 'react-router-dom'

export default function Layout() {
  return (
    <div>  


        <Navbar />   


        <div className="container mx-auto px-4 py-5 my-3 min-h-screen">
          <Outlet />
        </div>



        <Footer />
      
    </div>
  )
}
