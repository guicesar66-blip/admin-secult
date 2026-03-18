import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Unsplash images that match each opportunity theme
const imageMapping: Record<string, string> = {
  "Festival de Jazz do Recôncavo": "https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=800&q=80",
  "Documentário Vozes do Sertão": "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800&q=80",
  "EP Raízes Urbanas": "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80",
  "Exposição Digital Arte Negra": "https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=800&q=80",
  "Show Acústico Mulheres na Música": "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&q=80",
  "Vaga de Produtor Cultural": "https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?w=800&q=80",
  "Teatro Memórias de Minha Terra": "https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=800&q=80",
  "Festival LGBTQ+ de Artes": "https://images.unsplash.com/photo-1620735692151-26a7e0748571?w=800&q=80",
  "Vaga de Designer Gráfico Cultural": "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=800&q=80",
  "Álbum do Sertão - Forró Raiz": "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=800&q=80",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceKey);

    const results: string[] = [];

    // Get all oportunidades
    const { data: oportunidades, error } = await supabase
      .from("oportunidades")
      .select("id, titulo, imagem");

    if (error) throw error;

    for (const op of oportunidades || []) {
      const imageUrl = imageMapping[op.titulo];
      if (!imageUrl) {
        results.push(`Skipped: ${op.titulo} (no mapping)`);
        continue;
      }

      // Download image from Unsplash
      const response = await fetch(imageUrl);
      if (!response.ok) {
        results.push(`Failed to download: ${op.titulo}`);
        continue;
      }

      const imageData = await response.arrayBuffer();
      const fileName = `${op.id}.jpg`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from("oportunidades")
        .upload(fileName, imageData, {
          contentType: "image/jpeg",
          upsert: true,
        });

      if (uploadError) {
        results.push(`Upload error for ${op.titulo}: ${uploadError.message}`);
        continue;
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from("oportunidades")
        .getPublicUrl(fileName);

      // Update oportunidade with image URL
      const { error: updateError } = await supabase
        .from("oportunidades")
        .update({ imagem: urlData.publicUrl })
        .eq("id", op.id);

      if (updateError) {
        results.push(`Update error for ${op.titulo}: ${updateError.message}`);
        continue;
      }

      results.push(`✅ ${op.titulo}: ${urlData.publicUrl}`);
    }

    return new Response(JSON.stringify({ success: true, results }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
