/**
 * Robustly cleans a string that might contain JSON inside markdown code blocks or with leading/trailing text.
 */
function cleanAIJSON(text) {
  let cleaned = text.trim();
  
  // 1. Try to find content between ```json and ```
  const jsonMatch = cleaned.match(/```json\s*([\s\S]*?)\s*```/);
  if (jsonMatch) {
    return jsonMatch[1].trim();
  }
  
  // 2. Try to find content between ``` and ```
  const genericMatch = cleaned.match(/```\s*([\s\S]*?)\s*```/);
  if (genericMatch) {
    return genericMatch[1].trim();
  }
  
  // 3. If no backticks, try to find the first '{' or '[' and last '}' or ']'
  const braceMatch = cleaned.match(/(\{[\s\S]*\}|\[[\s\S]*\])/);
  if (braceMatch) {
    return braceMatch[1].trim();
  }
  
  // 4. Fallback to original text
  return cleaned;
}

module.exports = { cleanAIJSON };
