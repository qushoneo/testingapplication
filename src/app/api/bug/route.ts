import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { prisma } from '../lib/prisma';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!,
  {
    auth: {
      persistSession: false,
    },
  }
);

export async function GET(req: NextRequest) {
  const bugs = await prisma.bug.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });

  const bugsWithScreenshot = bugs.map((bug) => ({
    ...bug,
    screenshot: `${process.env.SUPABASE_URL}/storage/v1/object/public/bugs/${bug.screenshot}`,
  }));

  return NextResponse.json(bugsWithScreenshot);
}

export async function POST(req: NextRequest) {
  const { bugText, screenshot } = await req.json();

  const base64Data = screenshot.replace(/^data:image\/\w+;base64,/, '');

  const buffer = Buffer.from(base64Data, 'base64');

  console.log(buffer);

  const { data, error } = await supabase.storage
    .from('bugs')
    .upload(`bug-${Date.now()}.png`, buffer, {
      contentType: 'image/png',
    });

  if (!data) {
    return NextResponse.json({ message: 'Upload error' }, { status: 500 });
  }

  await prisma.bug.create({
    data: {
      text: bugText,
      screenshot: data.path,
    },
  });

  if (error) {
    console.error('Upload error:', error);
  } else {
    console.log('Upload success:', data);
  }

  return NextResponse.json({ message: 'Bug sent' });
}
