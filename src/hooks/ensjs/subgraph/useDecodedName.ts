import { QueryFunctionContext, queryOptions, useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { Config } from 'wagmi'

import {
  getDecodedName,
  GetDecodedNameParameters,
  GetDecodedNameReturnType,
} from '@ensdomains/ensjs/subgraph'
import { checkIsDecrypted } from '@ensdomains/ensjs/utils'

import { useQueryOptions } from '@app/hooks/useQueryKeyFactory'
import { CreateQueryKey, PartialBy, PublicClientWithChain, QueryConfig } from '@app/types'

type UseDecodedNameParameters = PartialBy<GetDecodedNameParameters, 'name'>

type UseDecodedNameReturnType = GetDecodedNameReturnType

type UseDecodedNameConfig = QueryConfig<UseDecodedNameReturnType, Error>

type QueryKey<TParams extends UseDecodedNameParameters> = CreateQueryKey<
  TParams,
  'getDecodedName',
  'graph'
>

export const getDecodedNameQueryFn =
  (config: Config) =>
  async <TParams extends UseDecodedNameParameters>({
    queryKey: [{ name, ...params }, chainId],
  }: QueryFunctionContext<QueryKey<TParams>>) => {
    if (!name) throw new Error('name is required')

    const publicClient = config.getClient({ chainId }) as PublicClientWithChain

    return getDecodedName(publicClient, { name, ...params })
  }

export const useDecodedName = <TParams extends UseDecodedNameParameters>({
  // config
  gcTime = 60,
  enabled = true,
  staleTime,
  scopeKey,
  // params
  ...params
}: TParams & UseDecodedNameConfig) => {
  const initialOptions = useQueryOptions({
    params,
    scopeKey,
    functionName: 'getDecodedName',
    queryDependencyType: 'graph',
    queryFn: getDecodedNameQueryFn,
  })

  const preparedOptions = queryOptions({
    queryKey: initialOptions.queryKey,
    queryFn: initialOptions.queryFn,
  })

  const nameIsEncrypted = useMemo(
    () => (params.name ? !checkIsDecrypted(params.name) : false),
    [params.name],
  )

  const query = useQuery({
    ...preparedOptions,
    enabled: enabled && !!params.name && nameIsEncrypted,
    gcTime,
    staleTime,
  })

  return {
    ...query,
    isCachedData: query.status === 'success' && query.isFetched && !query.isFetchedAfterMount,
  }
}