import type { LinksFunction } from '@remix-run/node'
import { Links, LiveReload, Outlet } from '@remix-run/react'

import globalStylesUrl from './styles/global.css'
import globalMediumStylesUrl from './styles/global-medium.css'
import globalLargeStylesUrl from './styles/global-large.css'

export const links: LinksFunction = () => [
  {
    rel: 'stylesheet',
    href: globalStylesUrl,
  },
  {
    rel: 'stylesheet',
    href: globalMediumStylesUrl,
    media: 'print, (min-width: 640px)',
  },
  {
    rel: 'stylesheet',
    href: globalLargeStylesUrl,
    media: 'screen and (min-width: 1024px)',
  },
]

export default function App() {
  return (
    <html lang='en-GB'>
      <head>
        <meta charSet='utf-8' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <meta name='title' content='Remix Jokes API' />
        <meta
          name='description'
          content='Joke API powered by Remix.js following their tutorial series.'
        />
        <meta
          name='keywords'
          content='joke, remix, remix.js, react, javascript, jokes, bad jokes, dad jokes'
        />
        <meta name='robots' content='index, follow' />
        <meta httpEquiv='Content-Type' content='text/html; charset=utf-8' />
        <meta name='language' content='English' />
        <meta name='author' content='TimBryanDev' />

        <title>Remix: So great, it's funny!</title>

        <Links />
      </head>
      <body>
        <Outlet />
        <LiveReload />
      </body>
    </html>
  )
}
