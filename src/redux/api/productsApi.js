import {rootApi} from '../../api/apiCall';
import {GET_PRODUCT_URL} from '../../api/url';

export const productsApi = rootApi.injectEndpoints({
  endpoints: build => ({
    getProducts: build.query({
      query: ({limit = 10, skip = 0}) => ({
        url: GET_PRODUCT_URL,
        method: 'GET',
        params: {limit, skip},
      }),
      transformResponse: res => ({
        products: res.products,
        total: res.total,
      }),
    }),
    getProductById: build.query({
      query: productId => ({
        url: `${GET_PRODUCT_URL}/${productId}`,
        method: 'GET',
      }),
      providesTags: ['products'],
    }),
    searchProducts: build.query({
      query: searchQuery => ({
        url: `${GET_PRODUCT_URL}/search`,
        method: 'GET',
        params: {q: searchQuery},
      }),
      transformResponse: res => ({
        products: res.products,
        total: res.total,
      }),
      providesTags: ['products'],
    }),
  }),
  overrideExisting: true,
});

export const {
  useLazyGetProductsQuery,
  useGetProductByIdQuery,
  useLazySearchProductsQuery,
} = productsApi;
