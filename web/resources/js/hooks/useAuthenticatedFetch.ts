import { Redirect } from '@shopify/app-bridge/actions'
import type { ClientApplication } from '@shopify/app-bridge/client'

interface Headers {
  get(header: string): string | null
}

function checkHeadersForReauthorization(headers: Headers, app: ClientApplication): void {
  if (headers.get('X-Shopify-API-Request-Failure-Reauthorize') === '1') {
    const authUrlHeader = headers.get('X-Shopify-API-Request-Failure-Reauthorize-Url') || `/api/auth`

    const redirect = Redirect.create(app)
    redirect.dispatch(
      Redirect.Action.REMOTE,
      authUrlHeader.startsWith('/') ? `https://${window.location.host}${authUrlHeader}` : authUrlHeader,
    )
  }
}

/**
 * A hook that returns an auth-aware fetch function.
 * @desc The returned fetch function that matches the browser's fetch API
 * See: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
 * It will provide the following functionality:
 *
 * 1. Add a `X-Shopify-Access-Token` header to the request.
 * 2. Check response for `X-Shopify-API-Request-Failure-Reauthorize` header.
 * 3. Redirect the user to the reauthorization URL if the header is present.
 *
 * @returns {Function} fetch function
 */
export function useAuthenticatedFetch() {
  // const app = useAppBridge();

  return async (uri: string, options?: RequestInit): Promise<Response> => {
    console.log(uri)
    const response = await fetch(uri, options)
    // checkHeadersForReauthorization(response.headers, app);
    return response
  }
}
