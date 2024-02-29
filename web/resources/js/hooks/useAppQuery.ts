import {
  MutationKey,
  useMutation,
  UseMutationOptions,
  UseMutationResult,
  useQuery,
  UseQueryOptions,
} from '@tanstack/react-query'
import { useMemo } from 'react'

import { useAuthenticatedFetch } from './useAuthenticatedFetch'

interface AppQueryOptions<TData, TError> extends Omit<UseQueryOptions<TData, TError>, 'queryKey'> {
  url: string
  fetchInit?: RequestInit
  queryKey?: unknown[] // Ensure the queryKey is present
}

export const useAppQuery = <TData, TError>({
  url,
  fetchInit = {},
  ...reactQueryOptions
}: AppQueryOptions<TData, TError>): ReturnType<typeof useQuery> => {
  const authenticatedFetch = useAuthenticatedFetch()
  const fetch = useMemo(
    () => async () => {
      const response = await authenticatedFetch(url, fetchInit)
      if (!response.ok) {
        throw new Error('Failed to fetch data')
      }
      return (await response.json()) as Promise<TData>
    },
    [url, JSON.stringify(fetchInit), authenticatedFetch],
  )

  return useQuery<TData, TError>({
    queryKey: [url], // Provide a queryKey
    queryFn: fetch,
    ...reactQueryOptions,
  })
}

export const useAppMutation = <TData, TVariables, TError>({
  url,
  fetchInit = {},
  mutationKey,
  ...mutationOptions
}: Omit<UseMutationOptions<TData, TError, TVariables>, 'mutationKey'> & {
  url: string
  fetchInit?: RequestInit
  mutationKey?: MutationKey
}): UseMutationResult<TData, TError, TVariables, unknown> => {
  const authenticatedFetch = useAuthenticatedFetch()
  const mutation = useMemo(
    () => async (variables: TVariables) => {
      const response = await authenticatedFetch(url, {
        method: 'POST',
        body: JSON.stringify(variables),
        ...fetchInit,
      })
      if (!response.ok) {
        throw new Error('Failed to mutate data')
      }
      return (await response.json()) as Promise<TData>
    },
    [url, JSON.stringify(fetchInit), authenticatedFetch],
  )

  return useMutation<TData, TError, TVariables, unknown>({
    mutationFn: mutation,
    ...mutationOptions,
    mutationKey: mutationKey ?? [url], // Provide a mutationKey or default to [url]
  })
}
