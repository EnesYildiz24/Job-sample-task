import type { AlbumDto } from '~/composables/useApi'
import { proxyBackend } from '../../utils/backend'

export default defineEventHandler(async () => {
  return await proxyBackend<{ data: AlbumDto[] }>('/albums')
})
