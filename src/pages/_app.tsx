import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { withTRPC } from '@trpc/next'
import { loggerLink } from '@trpc/client/links/loggerLink'
import { httpBatchLink } from '@trpc/client/links/httpBatchLink'
import superjson from 'superjson'
import { AppRouter } from '../server/route/app.router'
function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}

export default withTRPC<AppRouter>({
  
  config({ ctx }) {
    function getBaseUrl() {
      if (typeof window !== 'undefined')
        // browser should use relative path
        return '';
      if (process.env.VERCEL_URL)
        // reference for vercel.com
        return `https://${process.env.VERCEL_URL}`;
      if (process.env.RENDER_INTERNAL_HOSTNAME)
        // reference for render.com
        return `http://${process.env.RENDER_INTERNAL_HOSTNAME}:${process.env.PORT}`;
      // assume localhost
      return `http://localhost:${process.env.PORT ?? 3000}`;
    }
    // process.env.NEXT_PUBLIC_VERCEL_URL ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}` :
    const url = 'http://localhost:3000/api/trpc'

    const links = [
      loggerLink(),
      httpBatchLink({
        maxBatchSize: 10,
        url: `${getBaseUrl()}/api/trpc`,
      })
    ]

    return {
      queryClientConfig: {
        defaultOptions: {
          queries: {
            staleTime: 60,
          }
        }
      },
      headers() {
        if (ctx?.req)
          return {
            ...ctx.req.headers,
          }
        return {}
      },
      links,
      transformer: superjson,
    }
  },
  ssr: true,
})(MyApp)
