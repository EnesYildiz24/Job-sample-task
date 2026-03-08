import type { AlbumDto } from '~/composables/useApi'
import { proxyBackend } from '../../utils/backend'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  return await proxyBackend<{ data: AlbumDto }>(`/albums/${id}`)
})
