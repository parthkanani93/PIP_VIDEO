import Favorites from '../containers/tabBar/favorites/Favorites';
import Home from '../containers/tabBar/home/Home';
import ProductDetails from '../containers/tabBar/home/ProductDetails';
import VideoScreen from '../pip/VideoScreen';
import TabNavigation from './type/TabNavigation';

export const TabRoute = {
  Home,
  Favorites,
};

export const StackRoute = {
  ProductDetails,
  TabNavigation,
  VideoScreen,
};
