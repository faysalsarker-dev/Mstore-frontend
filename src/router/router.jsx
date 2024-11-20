import { createBrowserRouter } from "react-router-dom";
import Layout from './../layout';
import BuyCard from "../pages/BuyCard";
import MyCard from "../pages/MyCard";
import Register from './../pages/login-register/Register';
import Login from "../pages/login-register/Login";
import Users from "../pages/admin/Users";
import AddCard from "../pages/admin/AddCard";
import CardManagement from "../pages/admin/CardManagement";
import SingleUser from "../pages/admin/SingleUser";


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
      },
      {
        path:'/add-card',
        element:<AddCard/>
      },
      {
        path:'/manage-card',
        element:<CardManagement/>
      },
      {
        path:'/single-user/:id',
        element:<SingleUser/>
      },
  

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