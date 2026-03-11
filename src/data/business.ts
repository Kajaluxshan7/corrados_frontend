import type { BusinessInfo } from '../types';

export const businessInfo: BusinessInfo = {
  name: "Corrado's Restaurant and Bar",
  address: '38 Baldwin Street, Whitby, ON, L1M 1A2',
  email: 'corradosrestaurant@rogers.com',
  phone: '(905) 655-3100',
  hours: 'Mon–Sun: 12pm – 10:30pm',
  orderUrl:
    'https://corradorestaurantandbar.orderingclub.com/en/whitby?menu=645bd7d1abbd6851c5f999c2_2',
  giftCardUrl: 'https://giftcards.bluestreakpos.net/Home/Purchase?UCID=78',
  social: [
    {
      name: 'Facebook',
      url: 'https://www.facebook.com/people/Corrados-Restaurant/100064117086171/',
      icon: 'facebook',
    },
    {
      name: 'Instagram',
      url: 'https://www.instagram.com/corrados.restaurant/',
      icon: 'instagram',
    },
    {
      name: 'Yelp',
      url: 'https://www.yelp.ca/biz/corrados-restaurant-whitby',
      icon: 'yelp',
    },
    {
      name: 'Tripadvisor',
      url: 'https://www.tripadvisor.ca/Restaurant_Review-g887229-d2469430-Reviews-Corrados_Restaurant_and_Bar-Brooklin_Whitby_Ontario.html',
      icon: 'tripadvisor',
    },
  ],
};
