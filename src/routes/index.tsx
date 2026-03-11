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
      { path: '/gift-cards', element: <GiftCards /> },
      { path: '/events', element: <Events /> },
      { path: '/gallery', element: <Gallery /> },
      { path: '/contact', element: <Contact /> },
    ],
  },
]);

export default router;
