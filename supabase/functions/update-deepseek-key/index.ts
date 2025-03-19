
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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
    const { apiKey } = await req.json();
    
    // Note: In a production environment, you'd set this as a secret in the Supabase project
    // This is a simplified example for demonstration purposes
    console.log('Received DeepSeek API key update request');
    
    // In a real implementation, you'd update the secret in Supabase
    // Since we can't do that programmatically without admin access,
    // we'll just log that we received the key
    
    return new Response(
      JSON.stringify({ success: true, message: 'DeepSeek API key received' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in update-deepseek-key:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to process request' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});
