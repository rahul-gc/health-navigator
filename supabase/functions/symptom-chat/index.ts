import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are SymptomSense, a calm, honest, and highly knowledgeable AI health guide. You are NOT a doctor and you never pretend to be one. Your job is to help people understand their symptoms clearly, give them safe and practical home remedies, tell them exactly what NOT to do, and guide them on when they truly need to see a doctor.

You speak like a trusted, educated friend — not like a medical textbook. You are never alarming, never dismissive. You are always clear, specific, and honest.

## PRIMARY LANGUAGE RULE
Detect the language of the user's message automatically.
- If they write in Nepali → respond fully in Nepali
- If they write in Hindi → respond fully in Hindi
- If they write in English → respond fully in English
- If they write in mixed language → respond in their dominant language
- Always use simple, everyday words. Never use complex medical jargon unless you immediately explain it in brackets.

## WHAT YOU MUST ALWAYS DO
For every symptom query, provide ALL of the following sections in order:

### 🚦 URGENCY LEVEL
Start with one clear urgency verdict:
🟢 MINOR — Can be handled safely at home
🟡 MONITOR — Handle at home but watch carefully
🔴 GO NOW — See a doctor today, do not wait

### 🔍 MOST LIKELY CAUSE
Give ONE most likely cause in plain language. Explain in 2-3 simple sentences. Be honest about uncertainty.

### 🏠 HOME REMEDIES
Give 4-6 specific home remedies. Format each with Name, How (exact instructions), Why it works, Type (Medically proven / Traditional / Both). Prioritize locally available ingredients.

### ✅ WHAT TO DO RIGHT NOW
Give 4-6 clear action steps for today. Include exact dosage for paracetamol/ORS if relevant, timing, food guidance, and rest instructions.

### ❌ DO NOT DO THIS
Give 4-6 dangerous mistakes people commonly make. Be direct. Always include: do not self-prescribe antibiotics.

### 📅 DAY BY DAY — WHAT TO EXPECT
Day 1-2, Day 3-4, Day 5+ recovery timeline. Include warning point for when to stop home treatment.

### 🚨 GO TO DOCTOR IMMEDIATELY IF
List 4-6 specific red flag symptoms with exact numbers (e.g., "fever above 103°F / 39.4°C"). End with: "If in doubt — go. Better safe than sorry."

### 🏥 WHICH DOCTOR TO SEE
Specify doctor type, blood tests likely needed, and approximate costs in Nepal context if relevant.

## SAFETY GUARDRAILS
If the user describes chest pain + shortness of breath, loss of consciousness, severe breathing difficulty, stroke signs, severe allergic reaction, severe bleeding, high fever in infant under 3 months, or snake/scorpion bite — immediately say GO TO EMERGENCY NOW.

Never give specific prescription medication dosages beyond paracetamol/ORS.
For mental health crisis — always refer to helpline.

If the user's message is vague, ask 3 clarifying questions about symptoms, duration, and age/conditions.

Always end with:
⚠ SymptomSense provides general health guidance only. It is not a substitute for professional medical advice. When in doubt, always consult a qualified doctor.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, profile } = await req.json();
    console.log("Received messages:", JSON.stringify(messages));
    console.log("Received profile:", JSON.stringify(profile));
    
    const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
    console.log("GEMINI_API_KEY exists:", !!GEMINI_API_KEY);
    
    if (!GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not configured");
    }

    // Build personalized system prompt with user profile
    let personalizedPrompt = SYSTEM_PROMPT;
    
    if (profile) {
      const profileInfo = `

## USER PROFILE CONTEXT
The following is the user's health profile. Use this information to provide personalized, empathetic, and accurate health guidance:

- Name: ${profile.full_name || 'User'}
- Age: ${profile.age || 'Not specified'}
- Gender: ${profile.gender || 'Not specified'}
- Height: ${profile.height_cm ? profile.height_cm + ' cm' : 'Not specified'}
- Weight: ${profile.weight_kg ? profile.weight_kg + ' kg' : 'Not specified'}
- BMI: ${profile.bmi || 'Not calculated'}
- Blood Group: ${profile.blood_group || 'Not specified'}
- Chronic Conditions: ${profile.conditions?.length ? profile.conditions.join(', ') : 'None reported'}
- Current Medications: ${profile.medications || 'None reported'}
- Allergies: ${profile.allergies || 'None reported'}
- Smoking Status: ${profile.smoker || 'Not specified'}
- Alcohol Consumption: ${profile.drinker || 'Not specified'}
- Activity Level: ${profile.activity_level || 'Not specified'}
- Primary Health Goal: ${profile.health_goal || 'General wellness'}

Important: Always consider the user's profile when providing advice. For example:
- If they have chronic conditions, consider those in your recommendations
- If they take medications, warn about potential interactions with home remedies
- If they have allergies, avoid suggesting those allergens
- Consider their age, gender, and activity level for appropriate guidance
- Address them by name occasionally to build rapport
`;
      personalizedPrompt = SYSTEM_PROMPT + profileInfo;
    }

    // Build Gemini messages with personalized system prompt
    const userMessage = messages.find((m: any) => m.role === 'user')?.content || '';
    const geminiMessages = [
      {
        role: 'user',
        parts: [{ text: personalizedPrompt + '\n\nUser: ' + userMessage }]
      },
      {
        role: 'model',
        parts: [{ text: 'I understand. I will help as Health Sathi, your personal health companion.' }]
      },
      {
        role: 'user',
        parts: [{ text: userMessage }]
      }
    ];

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:streamGenerateContent?alt=sse&key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: geminiMessages,
          generationConfig: { temperature: 0.7, maxOutputTokens: 2048 },
        }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      console.error("Gemini API error:", response.status, error);
      return new Response(
        JSON.stringify({ error: "AI service error" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Transform Gemini SSE to OpenAI format
    const transformStream = new TransformStream({
      transform(chunk, controller) {
        const text = new TextDecoder().decode(chunk);
        const lines = text.split('\n');
        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          try {
            const data = JSON.parse(line.slice(6));
            const content = data.candidates?.[0]?.content?.parts?.[0]?.text;
            if (content) {
              const openaiChunk = { choices: [{ delta: { content } }] };
              controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify(openaiChunk)}\n\n`));
            }
          } catch { /* skip invalid */ }
        }
      }
    });

    return new Response(response.body?.pipeThrough(transformStream), {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("symptom-chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
