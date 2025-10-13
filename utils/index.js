export function createPageUrl(name) {
  if (!name) return '/'
  // Convert PascalCase or camelCase to kebab-case paths
  const kebab = String(name)
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .toLowerCase()
  return `/${kebab}`
}

export default { createPageUrl }
