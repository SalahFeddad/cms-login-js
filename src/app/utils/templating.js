import { v4 as uuid } from 'uuid'

/**
 * Wrap given text with highlighting spans.
 * @param {string} text content to highlight.
 * @param {number} seconds number of seconds in-which to highlight.
 * @param {string} color to switch to for highlighting.
 * @returns {string} text wrapped with highlighting spans.
 */
export function highlighter (text, seconds = 1, color = 'yellow') {
  const id = uuid()
  const elementHTML = `<span id='${id}'>${text}</span>`

  setInterval(() => {
    const element = document.getElementById(id)

    if (element) {
      element.style.color === color
        ? element.style.color = null
        : element.style.color = color
    }
  }, seconds * 1000)

  return elementHTML
}

/**
 * Replace template variables with a given value and optionally highlight it.
 * @param {string} text to inject variables into.
 * @param {object} variables object containing the keys and values of template variables.
 */
export function injectVariables (text, variables = {}, highlight = true) {
  Object.keys(variables).forEach(variable => {
    text = text.replace(`{${variable}}`, highlighter(variables[variable]))
  })

  return text
}
