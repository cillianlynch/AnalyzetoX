import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!process.env.OPENAI_API_KEY) {
    return res
      .status(500)
      .json({ error: "Missing OPENAI_API_KEY in .env.local" });
  }

  const {
    screenshots,
    transcript,
    comments,
    article,
    rawText,
    mode,
  } = req.body || {};

  // Build the "Content Bank"
  const contentBank = `
=== SCREENSHOTS ===
${Array.isArray(screenshots) && screenshots.length
  ? screenshots.map((s) => JSON.stringify(s)).join("\n\n")
  : "None"}

=== TRANSCRIPT ===
${transcript ? JSON.stringify(transcript) : "None"}

=== COMMENTS ===
${comments ? JSON.stringify(comments) : "None"}

=== ARTICLE ===
${article ? (article.content || JSON.stringify(article)) : "None"}

=== RAW TEXT ===
${rawText || "None"}
`;
  // Output rules: use comments as signal but never reference them directly
  const outputRules = `
OUTPUT RULES (must follow):
- Do NOT mention YouTube, "comments", "commenters", "users", or "channel" in the final answer.
- Do NOT quote any comment text (no direct quotes, no "Top comment says...").
- Do NOT attribute any idea to a person (no @handles, no "someone said", no "a user mentioned").
- You MAY use ideas found in comments, but rewrite them as neutral observations with no source callouts.
- If the user asks for quotes, refuse and instead summarize the underlying ideas without attribution.
`;

  // Different instructions depending on mode
  const modeInstruction = (() => {
    switch (mode) {
      case "long_summary":
        return "Write a longer, detailed summary of the key points.";
      case "thread":
        return "Write a Twitter/X thread with numbered tweets explaining the key ideas.";
      case "tweet":
        return "Write a single concise tweet summarizing the most important insight.";
      case "timeline":
        return "Build a chronological timeline of events with clear, dated bullet points.";
      case "claims":
        return "Extract the main claims and, for each, list the supporting evidence from the content bank.";
      case "summary":
      default:
        return "Write a clear, concise summary of the key ideas.";
    }
  })();

  const userPrompt = `
You are a careful analyst. You are given a CONTENT BANK compiled from screenshots, transcripts, comments, articles, and raw text.

${outputRules}

User-selected mode: ${mode || "summary"}

Instruction:
${modeInstruction}

CONTENT BANK:
${contentBank}

Now produce the output in plain text.
`;

  try {
    const response = await client.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "user",
          content: userPrompt,
        },
      ],
    });

    const output = response.choices[0].message.content;
    return res.status(200).json({ output });
  } catch (error) {
    console.error("OpenAI error in /api/processContent:", error);

    // Fallback: return a debug-style output instead of hanging
    const fallback = `
[AI CALL FAILED]

Reason: ${error.message}

Here is the raw content bank so at least you see what was sent:

${contentBank}
`;

    return res.status(200).json({ output: fallback });
  }
}
