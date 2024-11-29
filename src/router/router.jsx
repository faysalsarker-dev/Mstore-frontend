import { createBrowserRouter } from "react-router-dom";
import Layout from './../layout';
import BuyCard from "../pages/BuyCard";
import MyCard from "../pages/MyCard";
import Register from './../pages/login-register/Register';
import Login from "../pages/login-register/Login";
import Users from "../pages/admin/Users";
import AddCard from "../pages/admin/AddCard";
import SingleUser from "../pages/admin/SingleUser";
import Dashboard from "../pages/admin/Deshboard";
import GetCard from "../pages/GetCard";
import UserRequest from "../pages/admin/UserRequest";
import ManageCard from "../pages/admin/CardManagement";
import Protector from "./Protector/Protector";


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
        element:<Protector><Users/></Protector>
      },
      {
        path:'/add-card',
        element:<Protector><AddCard/></Protector>
      },
      {
        path:'/manage-card',
        element:<Protector><ManageCard/></Protector>
      },
      {
        path:'/single-user/:id',
        element:<Protector><SingleUser/></Protector>
      },
      {
        path:'/dashboard',
        element:<Protector><Dashboard/></Protector>
      },
      {
        path:'/get-credit',
        element:<GetCard/>
      },
      {
        path:'/user-request',
        element:<Protector><UserRequest/></Protector>
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