import { extractJson } from "./json";

export type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

type ChatOptions = {
  maxTokens?: number;
  temperature?: number;
  timeoutMs?: number;
};

const BASE_URL = (process.env.LLM_BASE_URL ?? "http://127.0.0.1:17070/v1").replace(/\/+$/, "");
const MODEL = process.env.LLM_MODEL ?? "deepseek-v4.1-flash-free";
const API_KEY = process.env.LLM_API_KEY ?? "";

function headers(): HeadersInit {
  const value: Record<string, string> = { "Content-Type": "application/json" };
  if (API_KEY) value.Authorization = `Bearer ${API_KEY}`;
  return value;
}

export type ChatOutcome = {
  text: string;
  finishReason: string | null;
};

export async function chat(messages: ChatMessage[], options: ChatOptions = {}): Promise<string> {
  return (await chatDetailed(messages, options)).text;
}

export async function chatDetailed(
  messages: ChatMessage[],
  options: ChatOptions = {},
): Promise<ChatOutcome> {
  const body = {
    model: MODEL,
    messages,
    temperature: options.temperature ?? 0.4,
    max_tokens: options.maxTokens ?? 3000,
    stream: false,
  };

  let lastError: unknown;
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      const response = await fetch(`${BASE_URL}/chat/completions`, {
        method: "POST",
        headers: headers(),
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(options.timeoutMs ?? 180_000),
      });

      if (!response.ok) {
        const detail = (await response.text()).slice(0, 400);
        throw new Error(`Model menolak permintaan (${response.status}): ${detail}`);
      }

      const contentType = response.headers.get("content-type") ?? "";
      const outcome = contentType.includes("text/event-stream")
        ? await readSse(response)
        : await readJson(response);

      if (!outcome.text.trim()) throw new Error("Model mengembalikan jawaban kosong.");
      return outcome;
    } catch (error) {
      lastError = error;
      if (attempt < 2) await sleep(700 * (attempt + 1));
    }
  }

  throw lastError instanceof Error ? lastError : new Error("Model tidak bisa dihubungi.");
}

async function readJson(response: Response): Promise<ChatOutcome> {
  const data = (await response.json()) as {
    choices?: Array<{
      message?: { content?: string | null };
      finish_reason?: string | null;
    }>;
  };
  const choice = data.choices?.[0];
  return {
    text: choice?.message?.content ?? "",
    finishReason: choice?.finish_reason ?? null,
  };
}

async function readSse(response: Response): Promise<ChatOutcome> {
  const reader = response.body?.getReader();
  if (!reader) return { text: "", finishReason: null };

  const decoder = new TextDecoder();
  let buffer = "";
  let output = "";
  let finishReason: string | null = null;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed.startsWith("data:")) continue;
      const payload = trimmed.slice(5).trim();
      if (!payload || payload === "[DONE]") continue;
      try {
        const event = JSON.parse(payload) as {
          choices?: Array<{
            delta?: { content?: string };
            finish_reason?: string | null;
          }>;
        };
        output += event.choices?.[0]?.delta?.content ?? "";
        finishReason = event.choices?.[0]?.finish_reason ?? finishReason;
      } catch {
        // A partial or keep-alive event; the next one carries the text.
      }
    }
  }

  return { text: output, finishReason };
}

export async function chatJson<T>(
  messages: ChatMessage[],
  options: ChatOptions = {},
): Promise<T> {
  let current = messages;
  let lastError: unknown;

  for (let attempt = 0; attempt < 2; attempt += 1) {
    const raw = await chat(current, options);
    try {
      return extractJson<T>(raw);
    } catch (error) {
      lastError = error;
      current = [
        ...current,
        { role: "assistant", content: raw },
        {
          role: "user",
          content:
            "Jawaban itu bukan JSON yang valid. Kirim ulang jawaban yang sama sebagai JSON ketat saja, tanpa pagar markdown dan tanpa teks lain.",
        },
      ];
    }
  }

  throw lastError instanceof Error ? lastError : new Error("Model tidak mengembalikan JSON.");
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
