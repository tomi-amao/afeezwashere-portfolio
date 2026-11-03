import type { Content } from '~/data/site'

export function useContent() {
  const content = useState<Content>('content').value
  const countFor = (slug?: string) =>
    slug ? content.projects.filter((p) => p.categories.includes(slug)).length : content.projects.length
  return { ...content, countFor }
}
