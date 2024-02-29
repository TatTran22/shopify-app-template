import { router } from '@inertiajs/react'
import { NavMenu } from '@shopify/app-bridge-react'
import { BlockStack, Button, Card, EmptyState, Page } from '@shopify/polaris'
import { useTranslation } from 'react-i18next'

import { notFoundImage } from '../assets'

export default function NotFound() {
  const { t } = useTranslation()
  //   const navigate = useNavigate()
  return (
    <>
      <NavMenu>
        <a href="/" rel="home">
          Home
        </a>
      </NavMenu>
      <Page>
        <Card>
          <EmptyState heading={t('NotFound.heading')} image={notFoundImage}>
            <BlockStack gap={'400'}>
              <p>{t('NotFound.description')}</p>
              <Button variant="primary" onClick={() => router.visit('/')}>
                Go to dashboard
              </Button>
            </BlockStack>
          </EmptyState>
        </Card>
      </Page>
    </>
  )
}
