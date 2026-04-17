/**
 * Mapping function type for transforming input data
 */
type MappingFunction<TInput, TValue> = (input: TInput) => TValue

/**
 * Format definition for object transformation
 * - string: maps from input key (e.g., `newKey: 'oldKey'`)
 * - function: transforms input (e.g., `fullName: (i) => i.first + ' ' + i.last`)
 * - literal: static value (e.g., `type: 'premium'`)
 */
type FormatDefinition<TInput, TOutput> = {
  [K in keyof TOutput]: keyof TInput | MappingFunction<TInput, TOutput[K]> | TOutput[K]
}

/**
 * ObjectBuilder - Transform and map input objects to a desired format
 *
 * @param input - Source object to transform
 * @param format - Optional format definition mapping output keys to input keys,
 * transform functions, or literal values
 * @returns Transformed object following the format specification
 *
 * @example
 * // Key renaming
 * ObjectBuilder({ firstName: 'John' }, { name: 'firstName' })
 * // { name: 'John' }
 *
 * @example
 * // Function transformation
 * ObjectBuilder(
 *   { first: 'John', last: 'Doe' },
 *   { fullName: (i) => i.first + ' ' + i.last }
 * )
 * // { fullName: 'John Doe' }
 *
 * @example
 * // Literal value
 * ObjectBuilder({ id: 1 }, { id: 1, type: 'user' })
 * // { id: 1, type: 'user' }
 */
export function ObjectBuilder<TOutput>(
  input: Record<string, unknown>,
  format?: FormatDefinition<Record<string, unknown>, TOutput>
): TOutput {
  if (!format) {
    return input as unknown as TOutput
  }

  const result = {} as TOutput

  for (const key of Object.keys(format)) {
    const mapping = format[key as keyof TOutput]
    const outputKey = key as keyof TOutput

    if (typeof mapping === 'function') {
      result[outputKey] = (mapping as MappingFunction<typeof input, TOutput[typeof outputKey]>)(
        input
      )
    } else if (typeof mapping === 'string' && mapping in input) {
      // String mapping: only treat as key reference if it exists in input
      result[outputKey] = input[mapping] as TOutput[typeof outputKey]
    } else {
      // Literal value: use the value directly
      result[outputKey] = mapping as TOutput[typeof outputKey]
    }
  }

  return result
}
