export async function testApiConnection(url: string): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`API returned status ${response.status}`)
    }
    const data = await response.json()
    return { success: true, data }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
  }
}

export function extractFields(obj: any, prefix = ""): string[] {
  const fields: string[] = []

  function traverse(current: any, path: string) {
    if (current === null || current === undefined) return

    if (Array.isArray(current)) {
      const item = current[0]
      if (item && typeof item === "object") {
        traverse(item, path + "[]")
      } else if (item) {
        fields.push(`${path} (${typeof item})`)
      }
    } else if (typeof current === "object") {
      for (const key in current) {
        if (current.hasOwnProperty(key)) {
          const newPath = path ? `${path}.${key}` : key
          traverse(current[key], newPath)
        }
      }
    } else {
      fields.push(`${path} (${typeof current})`)
    }
  }

  traverse(obj, prefix)
  return fields
}

export function getNestedValue(obj: any, path: string): any {
  return path.split(".").reduce((current, key) => {
    if (key.endsWith("[]")) {
      const arrayKey = key.slice(0, -2)
      return current?.[arrayKey]?.[0]
    }
    return current?.[key]
  }, obj)
}

export function flattenObject(obj: any, prefix = "", result: Record<string, any> = {}): Record<string, any> {
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const value = obj[key]
      const newKey = prefix ? `${prefix}.${key}` : key

      if (value !== null && typeof value === "object" && !Array.isArray(value)) {
        flattenObject(value, newKey, result)
      } else if (Array.isArray(value) && value.length > 0) {
        result[newKey] = value
      } else if (typeof value !== "object") {
        result[newKey] = value
      }
    }
  }
  return result
}
