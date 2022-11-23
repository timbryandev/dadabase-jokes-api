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

function Document({
  children,
  title = `Remix: So great, it's funny!`,
}: {
  children: React.ReactNode
  title?: string
}) {
  return (
    <html lang='en-Gb'>
      <head>
        <meta charSet='utf-8' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <meta name='title' content={title} />
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
        <title>{title}</title>
        <Links />
      </head>
      <body>
        {children}
        <LiveReload />
      </body>
    </html>
  )
}

export default function App() {
  return (
    <Document>
      <Outlet />
    </Document>
  )
}
// 60
export function ErrorBoundary({ error }: { error: Error }) {
  return (
    <Document title='Uh-oh!'>
      <div className='error-container'>
        <h1>App Error</h1>
        <pre>{error.message}</pre>
      </div>
    </Document>
  )
}
