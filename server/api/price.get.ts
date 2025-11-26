import { createClient } from '@supabase/supabase-js';
import { getQuery } from 'h3';
import type { H3Event } from 'h3';

const normalizeSize = (width: number, height: number) => {
  const a = Math.min(width, height);
  const b = Math.max(width, height);
  return { width: a, height: b, size: `${a}x${b}` };
};

export default defineEventHandler(async (event: H3Event) => {
  const query = getQuery(event);
  const w = Number(query.width ?? query.w);
  const h = Number(query.height ?? query.h);

  if (!Number.isFinite(w) || !Number.isFinite(h) || w <= 0 || h <= 0) {
    throw createError({
      statusCode: 400,
      statusMessage: 'width and height are required numbers > 0'
    });
  }

  const { width, height, size } = normalizeSize(w, h);

  const config = useRuntimeConfig();
  const supabaseUrl = config.public.supabaseUrl;
  const supabaseKey =
    (config as any).supabaseServiceKey ||
    process.env.SUPABASE_SERVICE_KEY ||
    config.public.supabaseKey;

  if (!supabaseUrl || !supabaseKey) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Supabase credentials are missing'
    });
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  // Try by normalized size first, then by width/height
  const { data, error } = await supabase
    .from('format_prices')
    .select('size, width, height, price')
    .or(`size.eq.${size},and(width.eq.${width},height.eq.${height}),and(width.eq.${height},height.eq.${width})`)
    .maybeSingle();

  if (error && error.code !== 'PGRST116') {
    throw createError({
      statusCode: 500,
      statusMessage: error.message
    });
  }

  if (!data) {
    throw createError({
      statusCode: 404,
      statusMessage: 'format not found'
    });
  }

  return {
    request: { width, height, size },
    result: {
      size: data.size ?? size,
      width: data.width ?? width,
      height: data.height ?? height,
      price: data.price ?? null
    }
  };
});
