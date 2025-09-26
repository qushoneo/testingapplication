import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { prisma } from "../lib/prisma";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!,
  {
    auth: {
      persistSession: false,
    },
  }
);

/**
 * @swagger
 * /api/bug:
 *   get:
 *     summary: Получить все баг-репорты
 *     description: Возвращает список всех отправленных баг-репортов с URL-адресами скриншотов
 *     tags: [Bug Reports]
 *     responses:
 *       200:
 *         description: Список баг-репортов
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 allOf:
 *                   - $ref: '#/components/schemas/Bug'
 *                   - type: object
 *                     properties:
 *                       screenshot:
 *                         type: string
 *                         description: Полный URL скриншота
 *                         example: https://supabase-url/storage/v1/object/public/bugs/bug-1234567890.png
 */
export async function GET(req: NextRequest) {
  const bugs = await prisma.bug.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  const bugsWithScreenshot = bugs.map((bug) => ({
    ...bug,
    screenshot: `${process.env.SUPABASE_URL}/storage/v1/object/public/bugs/${bug.screenshot}`,
  }));

  return NextResponse.json(bugsWithScreenshot);
}

/**
 * @swagger
 * /api/bug:
 *   post:
 *     summary: Отправить баг-репорт
 *     description: Создает новый баг-репорт с текстом и скриншотом. Скриншот загружается в Supabase Storage.
 *     tags: [Bug Reports]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - bugText
 *               - screenshot
 *             properties:
 *               bugText:
 *                 type: string
 *                 description: Описание найденного бага
 *                 example: Кнопка "Сохранить" не работает на странице настроек
 *               screenshot:
 *                 type: string
 *                 format: base64
 *                 description: Скриншот в формате base64 (data:image/png;base64,...)
 *                 example: data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==
 *     responses:
 *       200:
 *         description: Баг-репорт успешно отправлен
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Bug sent
 *       500:
 *         description: Ошибка при загрузке или сохранении
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Upload error
 */
export async function POST(req: NextRequest) {
  const { bugText, screenshot } = await req.json();

  const base64Data = screenshot.replace(/^data:image\/\w+;base64,/, "");

  const buffer = Buffer.from(base64Data, "base64");

  console.log(buffer);

  const { data, error } = await supabase.storage
    .from("bugs")
    .upload(`bug-${Date.now()}.png`, buffer, {
      contentType: "image/png",
    });

  if (!data) {
    return NextResponse.json({ message: "Upload error" }, { status: 500 });
  }

  await prisma.bug.create({
    data: {
      text: bugText,
      screenshot: data.path,
    },
  });

  if (error) {
    console.error("Upload error:", error);
  } else {
    console.log("Upload success:", data);
  }

  return NextResponse.json({ message: "Bug sent" });
}
