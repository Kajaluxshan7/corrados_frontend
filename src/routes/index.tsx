import { createBrowserRouter } from 'react-router-dom';
import { MainLayout } from '../layouts';
import {
  Home,
  About,
  Menus,
  Specials,
  PartyMenus,
  FamilyMeals,
  GiftCards,
  Events,
  Gallery,
  Contact,
  NotFound,
} from '../pages';

const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/about', element: <About /> },
      { path: '/menus', element: <Menus /> },
      { path: '/specials', element: <Specials /> },
      { path: '/party-menus', element: <PartyMenus /> },
      { path: '/family-meals', element: <FamilyMeals /> },
      { path: '/events', element: <Events /> },
      { path: '/gallery', element: <Gallery /> },
      { path: '/contact', element: <Contact /> },
      { path: '*', element: <NotFound /> },
    ],
  },
]);

export default router;
