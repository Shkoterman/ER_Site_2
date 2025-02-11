import { NextResponse } from 'next/server';
import { postAirtableRegistration } from '@/api/airtable/postAirtableRegistration';

export async function POST(req: Request) {
  try {
    const { tgNick, name, eventId } = await req.json();

    if (!tgNick || !eventId) {
      return NextResponse.json(
        { error: 'Не все обязательные поля заполнены' },
        { status: 400 }
      );
    }

    await postAirtableRegistration({ tgNick, name, eventId });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Ошибка регистрации:', error);
    return NextResponse.json(
      { error: 'Ошибка при регистрации' },
      { status: 500 }
    );
  }
}
