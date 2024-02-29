import { usePage } from '@inertiajs/react'
import { Redirect } from '@shopify/app-bridge/actions'
import { useAppBridge } from '@shopify/app-bridge-react'
import { Banner, Layout, Page } from '@shopify/polaris'
import { useEffect, useState } from 'react'

export default function ExitIframe() {
  const app = useAppBridge()
  const a = usePage()
  const [showWarning, setShowWarning] = useState(false)

  useEffect(() => {
    if (!!app && !!window.location.search) {
      const params = new URLSearchParams(window.location.search)
      const redirectUri = params.get('redirectUri')
      const url = new URL(decodeURIComponent(redirectUri))

      if ([location.hostname, 'admin.shopify.com'].includes(url.hostname) || url.hostname.endsWith('.myshopify.com')) {
        const redirect = Redirect.create(app)
        redirect.dispatch(Redirect.Action.REMOTE, decodeURIComponent(redirectUri))
      } else {
        setShowWarning(true)
      }
    }
  }, [app, window.location.search, setShowWarning])

  useEffect(() => {
    shopify.loading(!showWarning)
  }, [showWarning])

  return (
    <Page narrowWidth>
      <Layout>
        <Layout.Section>
          <div style={{ marginTop: '100px' }}>
            <Banner title="Redirecting outside of Shopify" tone="warning">
              Apps can only use /exitiframe to reach Shopify or the app itself.
            </Banner>
          </div>
        </Layout.Section>
      </Layout>
    </Page>
  )
}
