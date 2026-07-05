export async function onRequest(context) {
  if (context.request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  const body = await context.request.json();
  const { recipient_email, recipient_username, message } = body;

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer re_RTF6iWuv_6bcrK8cNkkxvr71aww1AwcAh',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      from: 'Tell Me Something <onboarding@resend.dev>',
      to: 'tellmesomething.app@gmail.com',
      subject: '👁️ Tu as reçu un nouveau message anonyme !',
      html: `
        <div style="font-family:sans-serif;max-width:500px;margin:0 auto;background:#0a0a0a;color:#fff;padding:30px;border-radius:16px;">
          <h1 style="color:#6366f1;">👁️ Tell Me Something</h1>
          <p style="color:#888;">@${recipient_username} a reçu un nouveau message anonyme :</p>
          <div style="background:#1a1a1a;padding:20px;border-radius:10px;margin:20px 0;border-left:3px solid #6366f1;">
            <p style="font-size:16px;">${message}</p>
          </div>
          <a href="https://tell-me-something.pages.dev/app/" style="background:#6366f1;color:#fff;padding:14px 24px;border-radius:10px;text-decoration:none;display:inline-block;">
            Voir mes messages
          </a>
          <p style="color:#555;font-size:12px;margin-top:20px;">L'identité de l'expéditeur reste secrète.</p>
        </div>
      `
    })
  });

  if (response.ok) {
    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } else {
    return new Response(JSON.stringify({ error: 'Failed' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}