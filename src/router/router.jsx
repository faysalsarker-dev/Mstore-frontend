import { createBrowserRouter } from "react-router-dom";
import Layout from './../layout';
import BuyCard from "../pages/BuyCard";
import MyCard from "../pages/MyCard";
import Register from './../pages/login-register/Register';
import Login from "../pages/login-register/Login";
import Users from "../pages/admin/Users";


const router = createBrowserRouter([
  {
    path: "/",
    element:<Layout/>,
    children:[
      {
        index:true,
        element:<BuyCard/>
      },
      {
        path:'/my-cards',
        element:<MyCard/>
      },
      {
        path:'/users',
        element:<Users/>
      }
  

    ]
  
    
  },
  {
    path:'/register',
    element:<Register/>
  },
  {
    path:'/login',
    element:<Login/>
  },

]);

export default router;