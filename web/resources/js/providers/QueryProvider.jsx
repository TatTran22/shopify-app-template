import { MutationCache, QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query'

export default function QueryProvider({ children }) {
  const [client] = React.useState(
    () =>
      new QueryClient({
        queryCache: new QueryCache(),
        mutationCache: new MutationCache(),
      }),
  )

  return <QueryClientProvider client={client}>{children}</QueryClientProvider>
}
