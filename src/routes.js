import Dashboard from "views/Dashboard.js";
import Map from "views/Map.js";
import Notifications from "views/Notifications.js";
import TableList from "views/TableList.js";
import Typography from "views/Typography.js";
import UserProfile from "views/UserProfile.js";
import Piso1 from "views/Pisos/Piso1.js";
import Piso2 from "views/Pisos/Piso2.js";
import Piso3 from "views/Pisos/Piso3.js";
import Piso4 from "views/Pisos/Piso4.js";
import Piso5 from "views/Pisos/Piso5.js";
import Piso6 from "views/Pisos/Piso6.js";
import Piso7 from "views/Pisos/Piso7.js";
import Terraza from "views/Pisos/Terraza.js";
import Prezurisacion from "views/Sistemas/Prezurisacion";

var routes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: "fa fa-building",
    component: <Dashboard />,
    layout: "/admin",
  },

  {
    path: "/map",
    name: "Map",
    icon: "tim-icons icon-pin",
    component: <Map />,
    layout: "/admin",
  },
  {
    path: "/notifications",
    name: "Notifications",

    icon: "tim-icons icon-bell-55",
    component: <Notifications />,
    layout: "/admin",
  },
  {
    path: "/user-profile",
    name: "User Profile",

    icon: "tim-icons icon-single-02",
    component: <UserProfile />,
    layout: "/admin",
  },
  {
    path: "/tables",
    name: "Table List",

    icon: "tim-icons icon-puzzle-10",
    component: <TableList />,
    layout: "/admin",
  },
  {
    path: "/typography",
    name: "Typography",

    icon: "tim-icons icon-align-center",
    component: <Typography />,
    layout: "/admin",
  },

    // Rutas para los pisos
    { path: "/piso1", name: "Piso 1", icon: "icon-building", component: <Piso1 />, layout: "/admin", invisible: true },
    { path: "/piso2", name: "Piso 2", icon: "icon-building", component: <Piso2 />, layout: "/admin", invisible: true },
    { path: "/piso3", name: "Piso 3", icon: "icon-building", component: <Piso3 />, layout: "/admin", invisible: true },
    { path: "/piso4", name: "Piso 4", icon: "icon-building", component: <Piso4 />, layout: "/admin", invisible: true },
    { path: "/piso5", name: "Piso 5", icon: "icon-building", component: <Piso5 />, layout: "/admin", invisible: true },
    { path: "/piso6", name: "Piso 6", icon: "icon-building", component: <Piso6 />, layout: "/admin", invisible: true },
    { path: "/piso7", name: "Piso 7", icon: "icon-building", component: <Piso7 />, layout: "/admin", invisible: true },
    { path: "/terraza", name: "Terraza", icon: "icon-building", component: <Terraza />, layout: "/admin", invisible: true },

    // Rutas para los Sistemas
    {
      path: "/Prezurisacion",
      name: "Prezurisacion",
      icon: "tim-icons icon-atom",
      component: <Prezurisacion />,
      layout: "/admin",
    },
];
export default routes;
