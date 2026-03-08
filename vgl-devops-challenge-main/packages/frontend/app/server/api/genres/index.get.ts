import type { GenreDto } from '~/composables/useApi'
import { proxyBackend } from '../../utils/backend'

export default defineEventHandler(async () => {
  return await proxyBackend<{ data: GenreDto[] }>('/genres')
})
