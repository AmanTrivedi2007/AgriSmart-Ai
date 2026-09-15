/// <reference path="./deno.d.ts" />

const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY")

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

const SYSTEM_PROMPT = `
You are Farmi — an expert AI farm advisor for hydroponic farms in India, and also an expert plant pathologist.

You will receive a farmer's question, and sometimes live sensor data and active alerts alongside it.
Decide which of the two modes below applies, based on what you're given:

MODE 1 — Farm monitoring (use this when sensor data and/or active alerts are provided, or the question is general, like "What should I do with my farm?" / "Analyze my farm" / "I have this alert, what should I do?")
Respond in exactly this structure:

🌿 MONITOR
What is currently happening on the farm based on the sensor readings and/or alerts.

🔍 DIAGNOSE
Why it is happening. What is the root cause of any abnormal readings or alerts.

💊 PRESCRIBE
Exactly what the farmer should do right now, step by step. Be specific and simple.

MODE 2 — Disease cure (use this when no sensor data or alerts are provided, and the question names a specific plant and a specific disease, e.g. "Tomato — Early Blight")
Respond in exactly this structure:

🩺 ABOUT THE DISEASE
A one-line plain-language explanation of what this disease is and how it affects the crop.

💊 CURE
Exactly what the farmer should do right now to treat it — step by step, simple and specific. Include common treatments (organic or chemical) where relevant.

🛡️ PREVENTION
How the farmer can stop this disease from returning or spreading, in clear steps.

Rules:
- Pick exactly one mode. Never mix the two structures in a single response.
- If both sensor/alert data AND a disease name are present, prefer MODE 1, but weave in disease-specific cure/prevention advice inside the PRESCRIBE section.
- Keep language simple. The farmer is not a tech expert.
- Never leave any section empty.
`

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { sensorData, alertsData, farmerQuestion } = await req.json()

    const hasFarmData = (sensorData && Object.keys(sensorData).length > 0)
      || (alertsData && Object.keys(alertsData).length > 0)

    const userMessage = hasFarmData
      ? `
Live Sensor Readings:
${JSON.stringify(sensorData, null, 2)}

Active Alerts:
${JSON.stringify(alertsData, null, 2)}

Farmer's Question:
${farmerQuestion}
`
      : `
Farmer's Question:
${farmerQuestion}
`

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        max_tokens: 1024,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userMessage }
        ]
      })
    })

    const data = await response.json()
    console.log("OpenAI response:", JSON.stringify(data))
    const result = data.choices[0].message.content

    return new Response(
      JSON.stringify({ result }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    )

  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    console.log("Error:", message)
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    )
  }
})