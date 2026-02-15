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
    tone,
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

  // Tone instructions based on selected tone
  const toneInstruction = (() => {
    const selectedTone = tone || "balanced"; // default to balanced
    
    switch (selectedTone) {
      case "personal":
        return `
TONE: Personal and Conversational

Write like you're explaining this to a friend. Be warm, relatable, and human.

COMMENT USAGE - PRIMARY SOURCE:
- Comments are your MAIN content source. Extract the sentiment, insights, and reactions from them.
- If a comment says "this changed how I think" → Emphasize the transformative insight in your writing
- If a comment says "why doesn't everyone do this" → Frame as novel/overlooked approach
- If a comment shares results ("got 500 signups") → Include outcome-focused language
- Express the SAME sentiments from comments, just in conversational style

WRITING STYLE:
- Use "you" and "I/we" liberally
- Short, punchy sentences mixed with longer explanations
- Conversational phrases: "Here's the thing...", "I know what you're thinking..."
- Show energy and enthusiasm when comments show it
- Make it feel like advice from a knowledgeable friend

Remember: You're expressing THEIR insights (from comments), just in a friendly conversational way. Never quote directly, but convey the exact meaning.
`;
      
      case "analytical":
        return `
TONE: Analytical and Methodical  

Write objectively and precisely. Focus on logic, structure, and clear reasoning.

COMMENT USAGE - PRIMARY SOURCE:
- Comments are your MAIN data source. Extract specific insights, results, and patterns.
- If a comment mentions results ("got 500 signups") → Present as quantifiable data
- If a comment asks a question → Identify it as a recurring consideration
- If multiple comments mention same thing → Note it as a pattern
- Express the SAME information from comments, just in analytical language

WRITING STYLE:
- Precise, factual language
- Quantify when possible ("increased by factor of X")
- Clinical assessment style
- Minimal emotional language
- Logical structure and reasoning

Remember: Same data from comments, just expressed analytically and objectively. Never quote, but present the information precisely.
`;
      
      case "balanced":
      default:
        return `
TONE: Professional but Accessible

Write clearly and credibly, but keep it approachable. Balance structure with readability.

COMMENT USAGE - PRIMARY SOURCE:
- Comments are your MAIN source. Extract key insights, questions, and experiences people shared.
- If a comment shares an insight → Present it as a key finding
- If a comment asks a question → Address it as a common consideration
- If a comment shares results → Include as evidence of effectiveness
- Express the SAME points from comments, just in professional language

WRITING STYLE:
- Clear, structured sentences
- Professional vocabulary without being stuffy  
- Use frameworks and logical flow
- Present information credibly
- Balance accessibility with authority

Remember: Same insights from comments, just expressed professionally. Never quote, but convey the meaning clearly and credibly.
`;
    }
  })();

  // Different instructions depending on mode
  const modeInstruction = (() => {
    switch (mode) {
      // TWEETS & THREADS
      case "tweet_single":
        return "Write exactly ONE tweet, approximately 280 characters. Include a strong hook and one key insight. Make every word count.";
      
      case "thread_short":
        return "Write exactly 5 numbered tweets forming a cohesive thread. Tweet 1: Hook that grabs attention. Tweets 2-4: Core insights or main points. Tweet 5: Strong conclusion or call-to-action. Each tweet should stand alone but connect to the overall narrative.";
      
      case "thread_medium":
        return "Write exactly 10 numbered tweets. Tweet 1: Compelling hook. Tweets 2-9: Detailed breakdown of key points with examples or insights. Tweet 10: Memorable conclusion or clear call-to-action. This is the standard thread format.";
      
      case "thread_long":
        return "Write exactly 15 numbered tweets. Tweet 1: Strong hook. Tweets 2-14: In-depth analysis with multiple angles, examples, and insights. Tweet 15: Powerful conclusion or call-to-action. Go deep on the topic.";
      
      case "thread_mega":
        return "Write 20-25 numbered tweets. Tweet 1: Compelling hook. Tweets 2-23: Comprehensive breakdown with sub-sections, multiple examples, case studies, and detailed insights. Final tweet: Strong conclusion. This should be an ultimate guide-style thread.";
      
      // SUMMARIES
      case "summary_bullets":
        return "Write a 200-300 word summary in bullet point format. Create 5-7 bullet points, each 30-50 words (1-2 sentences). Make each bullet scannable and actionable. Use • bullet format. Focus on key takeaways.";
      
      case "summary_prose":
        return "Write a 300-500 word summary in flowing paragraph format. Create 3-5 connected paragraphs with natural transitions between ideas. Write in a readable, engaging narrative style that flows naturally.";
      
      case "deep_dive":
        return "Write an 800-1200 word comprehensive analysis. Structure it with 5-7 sections, each with a clear header (use ## markdown). Include examples, context, and implications. This should be article-quality depth with multiple perspectives.";
      
      // SPECIALIZED FORMATS
      case "timeline":
        return "Create a 300-600 word chronological timeline. Format each entry as: • [Date/Time]: [Event] - [Brief description]. Use specific dates when available, or relative dates (Day 1, Day 30, Week 1). Show clear progression and momentum. Good for case studies and transformation stories.";
      
      case "claims_evidence":
        return "Write a 500-700 word analysis in claims + evidence format. Identify 4-6 main claims from the content. For each claim, list 3-5 supporting evidence points. Format as: **Claim 1:** [Statement], Evidence: • Point A, • Point B, etc. Be analytical and show your reasoning.";
      
      // LEGACY SUPPORT (map old modes to new ones)
      case "summary":
        return "Write a 300-500 word summary in flowing paragraph format. Create 3-5 connected paragraphs with natural transitions between ideas. Write in a readable, engaging narrative style that flows naturally.";
      
      case "long_summary":
        return "Write an 800-1200 word comprehensive analysis. Structure it with 5-7 sections, each with a clear header (use ## markdown). Include examples, context, and implications. This should be article-quality depth with multiple perspectives.";
      
      case "thread":
        return "Write exactly 10 numbered tweets. Tweet 1: Compelling hook. Tweets 2-9: Detailed breakdown of key points with examples or insights. Tweet 10: Memorable conclusion or clear call-to-action. This is the standard thread format.";
      
      case "tweet":
        return "Write exactly ONE tweet, approximately 280 characters. Include a strong hook and one key insight. Make every word count.";
      
      case "timeline":
        return "Create a 300-600 word chronological timeline. Format each entry as: • [Date/Time]: [Event] - [Brief description]. Use specific dates when available, or relative dates (Day 1, Day 30, Week 1). Show clear progression and momentum. Good for case studies and transformation stories.";
      
      case "claims":
        return "Write a 500-700 word analysis in claims + evidence format. Identify 4-6 main claims from the content. For each claim, list 3-5 supporting evidence points. Format as: **Claim 1:** [Statement], Evidence: • Point A, • Point B, etc. Be analytical and show your reasoning.";
      
      default:
        return "Write a clear, concise summary of the key ideas in 300-500 words.";
    }
  })();

  const userPrompt = `
You are a careful analyst. You are given a CONTENT BANK compiled from screenshots, transcripts, comments, articles, and raw text.

${toneInstruction}

${outputRules}

User-selected mode: ${mode || "summary_prose"}
User-selected tone: ${tone || "balanced"}

Instruction:
${modeInstruction}

CONTENT BANK:
${contentBank}

Now produce the output in plain text.
`;

  try {
    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
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
