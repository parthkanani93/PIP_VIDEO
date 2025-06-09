import {rootApi} from '../../api/apiCall';
import {GET_PRODUCT_URL} from '../../api/url';
import {GEMINI_API_KEY} from '@env';

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
    getGeminiAnalysis: build.mutation({
      query: product => ({
        url: `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: {
          contents: [
            {
              role: 'user',
              parts: [
                {
                  text: `Analyze this product and suggest highlights, use cases, and potential issues:\n\n${JSON.stringify(
                    product,
                    null,
                    2,
                  )}`,
                },
              ],
            },
          ],
        },
      }),
    }),
  }),
  overrideExisting: true,
});

export const {
  useLazyGetProductsQuery,
  useGetProductByIdQuery,
  useLazySearchProductsQuery,
  useGetGeminiAnalysisMutation,
} = productsApi;
