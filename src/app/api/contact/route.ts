import { NextResponse } from 'next/server';
import { contactSchema } from '@/features/contact/schemas/contact.schema';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate request body
    const validatedData = contactSchema.parse(body);

    // In a real application, you would send an email here using Resend, SendGrid, etc.
    // Example:
    // await resend.emails.send({
    //   from: 'onboarding@resend.dev',
    //   to: process.env.CONTACT_EMAIL_TO,
    //   subject: `New Contact from ${validatedData.name}`,
    //   text: `...`,
    // });
    
    console.log('Received contact form submission:', validatedData);

    // Simulate network delay for MVP
    await new Promise(resolve => setTimeout(resolve, 1000));

    return NextResponse.json(
      { message: 'Pesan berhasil dikirim' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Contact API Error:', error);
    return NextResponse.json(
      { error: 'Gagal mengirim pesan' },
      { status: 500 }
    );
  }
}
