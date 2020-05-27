export const API_URL = process.env.NODE_ENV === 'production' ? 'https://accountapi.exchangedataset.cc' : 'http://localhost:3002';
export const API_ERR_NOT_LOGGED_IN = 'you don\'t have a permission to access this resource';
export const STRIPE_TOKEN = process.env.PAYMENT_ENV === 'live' ? 'pk_live_Z1dwHJmuM9tU7iHih8iNkIsX00eJCHz6FL' : 'pk_test_gSZxwrZFpWcMxhemNSyAx53t00xr5iuhNT';
export const PRICING = [
  {
    end: 1,
    price: 10,
  },
  {
    end: 30,
    price: 1,
  },
  {
    end: 200,
    price: 0.4,
  },
  {
    end: 1000,
    price: 0.35,
  },
  {
    end: Number.POSITIVE_INFINITY,
    price: 0.3,
  },
];

export const calcPrice = (origQuota) => {
  let price = Math.min(origQuota, PRICING[0].end) * PRICING[0].price;
  let quota = Math.max(origQuota - PRICING[0].end, 0);
  for (let i = 1; i < PRICING.length; i += 1) {
    const step = PRICING[i].end - PRICING[i - 1].end;
    price += Math.min(quota, step) * PRICING[i].price;
    quota = Math.max(quota - step, 0);
  }
  return price;
};
