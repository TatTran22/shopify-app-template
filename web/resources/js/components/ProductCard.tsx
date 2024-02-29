import { BlockStack, Button, ButtonGroup, Card, InlineStack, Text } from '@shopify/polaris'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { useAppQuery, useAuthenticatedFetch } from '@/hooks'

interface CreatedResponse {
  count: number
}

interface ErrorResponse {
  errors: {
    message: string
  }
}

export function ProductsCard() {
  const [isLoading, setIsLoading] = useState(false)
  const fetch = useAuthenticatedFetch()
  const { t } = useTranslation()
  const productsCount = 5

  const { data, isLoading: isFetching } = useAppQuery<CreatedResponse, ErrorResponse>({
    url: '/api/products/count',
    fetchInit: {},
    queryKey: ['productsCount'],
  })

  useEffect(() => {
    setIsLoading(false)
  }, [data])

  const handlePopulate = async () => {
    setIsLoading(true)
    const response = await fetch('/api/products/create')
    setIsLoading(false)
    const successMessage = t('ProductsCard.productsCreatedToast', {
      count: productsCount,
    })
    const errorMessage = t('ProductsCard.errorCreatingProductsToast')
    shopify.toast.show(response.ok ? successMessage : errorMessage, {
      isError: !response.ok,
    })
  }

  return (
    <Card roundedAbove="sm">
      <BlockStack gap="200">
        <p>{t('ProductsCard.description')}</p>
        <Text as="h4" variant="headingMd">
          {t('ProductsCard.totalProductsHeading')}
          <Text variant="bodyMd" as="p" fontWeight="semibold">
            {/* @ts-ignore */}
            {isFetching ? '-' : data?.count}
          </Text>
        </Text>
      </BlockStack>
      <InlineStack align="end">
        <ButtonGroup>
          <Button onClick={() => {}} accessibilityLabel="Edit shipment">
            Edit shipment
          </Button>
          <Button
            variant="primary"
            onClick={handlePopulate}
            loading={isLoading}
            accessibilityLabel="Add tracking number"
          >
            {t('ProductsCard.populateProductsButton', {
              count: productsCount,
            })}
          </Button>
        </ButtonGroup>
      </InlineStack>
    </Card>
  )
}
