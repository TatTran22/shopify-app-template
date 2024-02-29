import { TitleBar } from '@shopify/app-bridge-react'
import { BlockStack, Card, Image, Layout, Link, Page, Text } from '@shopify/polaris'
import { Trans, useTranslation } from 'react-i18next'

import { trophyImage } from '@/assets'
import { ProductsCard } from '@/components/ProductCard'

export default function HomePage() {
  const { t } = useTranslation()
  return (
    <Page narrowWidth>
      <TitleBar title={t('HomePage.title')} />
      <Layout>
        <Layout.Section>
          <Card>
            <BlockStack>
              <BlockStack gap={'200'}>
                <BlockStack gap={'200'}>
                  <Text as="h2" variant="headingMd">
                    {t('HomePage.heading')}
                  </Text>
                  <p>
                    <Trans
                      i18nKey="HomePage.yourAppIsReadyToExplore"
                      components={{
                        PolarisLink: <Link url="https://polaris.shopify.com/" external />,
                        AdminApiLink: <Link url="https://shopify.dev/api/admin-graphql" external />,
                        AppBridgeLink: <Link url="https://shopify.dev/apps/tools/app-bridge" external />,
                      }}
                    />
                  </p>
                  <p>{t('HomePage.startPopulatingYourApp')}</p>
                  <p>
                    <Trans
                      i18nKey="HomePage.learnMore"
                      components={{
                        ShopifyTutorialLink: (
                          <Link url="https://shopify.dev/apps/getting-started/add-functionality" external />
                        ),
                      }}
                    />
                  </p>
                </BlockStack>
              </BlockStack>
              <BlockStack>
                <div style={{ padding: '0 20px' }}>
                  <Image source={trophyImage} alt={t('HomePage.trophyAltText')} width={120} />
                </div>
              </BlockStack>
            </BlockStack>
          </Card>
        </Layout.Section>
        <Layout.Section>
          <ProductsCard />
        </Layout.Section>
      </Layout>
    </Page>
  )
}
