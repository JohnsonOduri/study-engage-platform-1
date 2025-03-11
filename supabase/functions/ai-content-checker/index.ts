
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

// Define CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get request body
    const { userId, text } = await req.json();

    if (!userId || !text) {
      return new Response(
        JSON.stringify({ 
          error: "Missing required fields: userId and text are required" 
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      );
    }

    // In a real implementation, we would:
    // 1. Fetch the user's OpenAI API key from the database
    // 2. Make a request to OpenAI API to analyze the text
    // 3. Process the results and return them
    
    // For now, we'll return mock data
    const aiProbability = Math.random() * 100;
    const plagiarismScore = Math.random() * 100;
    const analysisResults = [
      aiProbability > 70 ? 
        "This text shows strong indicators of AI generation." : 
        "This text appears to be primarily human-written.",
      plagiarismScore > 30 ?
        "Multiple sections appear to be copied from existing sources." :
        "No significant matching content was found in our database.",
      "Sentence structures exhibit " + (aiProbability > 70 ? "high" : "low") + " uniformity.",
      "Vocabulary diversity is " + (aiProbability > 70 ? "limited" : "natural") + ".",
      "Transitional phrases are " + (aiProbability > 70 ? "repetitive" : "varied") + "."
    ];

    console.log(`Analyzed content for user ${userId}, AI probability: ${aiProbability.toFixed(1)}%`);

    return new Response(
      JSON.stringify({
        aiProbability,
        plagiarismScore,
        analysisResults
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error in ai-content-checker function:", error);
    return new Response(
      JSON.stringify({ error: error.message || "An error occurred" }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
