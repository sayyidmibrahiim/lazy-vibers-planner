/**
 * Extract the first JSON object or array from model output.
 * Models wrap JSON in fences or prose often enough that JSON.parse alone is not reliable.
 */
export function extractJson<T>(raw: string): T {
  const text = raw.replace(/^\uFEFF/, "").trim();

  const fence = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidates = fence ? [fence[1].trim(), text] : [text];

  for (const candidate of candidates) {
    const direct = tryParse<T>(candidate);
    if (direct.ok) return direct.value;

    const start = candidate.search(/[{[]/);
    if (start === -1) continue;

    const sliced = balancedSlice(candidate, start);
    if (sliced) {
      const parsed = tryParse<T>(sliced);
      if (parsed.ok) return parsed.value;
    }
  }

  throw new Error("Model did not return valid JSON.");
}

function tryParse<T>(value: string): { ok: true; value: T } | { ok: false } {
  try {
    return { ok: true, value: JSON.parse(value) as T };
  } catch {
    return { ok: false };
  }
}

/** Return the substring that closes the first object or array at `start`. */
function balancedSlice(text: string, start: number): string | null {
  const open = text[start];
  if (open !== "{" && open !== "[") return null;

  const stack: string[] = [];
  let inString = false;
  let escaped = false;

  for (let i = start; i < text.length; i += 1) {
    const char = text[i];

    if (inString) {
      if (escaped) escaped = false;
      else if (char === "\\") escaped = true;
      else if (char === '"') inString = false;
      continue;
    }

    if (char === '"') {
      inString = true;
      continue;
    }

    if (char === "{" || char === "[") {
      stack.push(char);
      continue;
    }

    if (char === "}" || char === "]") {
      const expected = char === "}" ? "{" : "[";
      if (stack.pop() !== expected) return null;
      if (stack.length === 0) return text.slice(start, i + 1);
    }
  }

  return null;
}
