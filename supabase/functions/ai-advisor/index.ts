/// <reference path="./deno.d.ts" />

const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY")

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

const SYSTEM_PROMPT = `
You are Farmi — an expert AI farm advisor for hydroponic farms in India.
You have access to live sensor data and active alerts from the farmer's farm.
Always respond in exactly this structure:

🌿 MONITOR
What is currently happening on the farm based on the sensor readings.

🔍 DIAGNOSE
Why it is happening. What is the root cause of any abnormal readings or alerts.

💊 PRESCRIBE
Exactly what the farmer should do right now, step by step. Be specific and simple.

Keep language simple. The farmer is not a tech expert.
Never leave any section empty.
`

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { sensorData, alertsData, farmerQuestion } = await req.json()

    const userMessage = `
Live Sensor Readings:
${JSON.stringify(sensorData, null, 2)}

Active Alerts:
${JSON.stringify(alertsData, null, 2)}

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