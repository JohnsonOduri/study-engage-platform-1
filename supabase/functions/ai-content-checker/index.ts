
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text } = await req.json();
    
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    // Make request to OpenAI API
    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are an AI content detection expert. Analyze the following text and provide:\n1. Probability of AI generation (as a percentage)\n2. Plagiarism likelihood (as a percentage)\n3. List of 5 key analysis points.\nRespond in JSON format only with these exact keys: aiProbability, plagiarismScore, analysis'
          },
          { role: 'user', content: text }
        ],
      }),
    });

    const aiResponse = await openAIResponse.json();
    const analysis = JSON.parse(aiResponse.choices[0].message.content);
    
    // Log the successful analysis
    console.log('Successfully analyzed content:', {
      textLength: text.length,
      aiProbability: analysis.aiProbability,
      plagiarismScore: analysis.plagiarismScore
    });

    return new Response(
      JSON.stringify(analysis),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in ai-content-checker:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});
