import type { ArtistDto } from '~/composables/useApi'
import { proxyBackend } from '../../utils/backend'

export default defineEventHandler(async () => {
  return await proxyBackend<{ data: ArtistDto[] }>('/artists')
})
