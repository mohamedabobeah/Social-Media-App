import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './App.css'
import Layout from './Layout/Layout'
import Home from './Pages/Home/Home'
import Profile from './Pages/Profile/Profile'
import Login from './Pages/Login/Login'
import Register from './Pages/Register/Register'
import Notfound from './Pages/Notfound/Notfound' 
import CounterContextProvider from './Context/CounterContext'  
import AuthContextProvider from './Context/AuthContext'
import ProtectedRoute from './Components/ProtecetedRoute/ProtectedRoute' 
import {QueryClientProvider, QueryClient} from "@tanstack/react-query"
import PostDetails from './Pages/PostDetails/PostDetails' 
import  { Toaster } from 'react-hot-toast';  
import {useNetworkState} from "react-use";
import Offline from './Components/Offline/Offline'



const query = new QueryClient(); 




const routers = createBrowserRouter([
  {
    path: "", 
    element: <Layout />, 
    children:  [
      {index: true, element: <ProtectedRoute> <Home />  </ProtectedRoute>}, 
      {path: "home", element: <ProtectedRoute> <Home />  </ProtectedRoute>},
      {path: "profile", element: <ProtectedRoute> <Profile />   </ProtectedRoute>},   
      {path: "postdetails/:id", element: <ProtectedRoute> <PostDetails />   </ProtectedRoute>}, 
      {path: "login", element: <Login />}, 
      {path: "register", element: <Register />},
      {path: "*", element: <Notfound />} ,
    ],
  },
]);

function App() {  

  const {online} = useNetworkState(); 
  

  return (
    <>       

    {!online && <Offline />} 

    <QueryClientProvider client = {query}>  



      
    <AuthContextProvider>
      
    <CounterContextProvider>
        <RouterProvider router = {routers}></RouterProvider>
    </CounterContextProvider> 
    <Toaster />
      
    </AuthContextProvider>
      
      
      
      
      
      </QueryClientProvider> 

    </>
  )
}

export default App
