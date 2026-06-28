export async function onRequest(context) {
  const url = new URL(context.request.url);
  const username = url.searchParams.get('u') || '';
  const cleanName = username.replace(/[^a-zA-Z0-9_-]/g, '');

  if (!cleanName) {
    return Response.redirect('https://tell-me-something.pages.dev/app/', 302);
  }

  const acceptLang = context.request.headers.get('Accept-Language') || 'en';
  const lang = acceptLang.toLowerCase().startsWith('ar') ? 'ar' :
               acceptLang.toLowerCase().startsWith('en') ? 'en' :
               acceptLang.toLowerCase().startsWith('es') ? 'es' :
               acceptLang.toLowerCase().startsWith('de') ? 'de' :
               acceptLang.toLowerCase().startsWith('it') ? 'it' :
               acceptLang.toLowerCase().startsWith('pt') ? 'pt' :
               acceptLang.toLowerCase().startsWith('tr') ? 'tr' :
               acceptLang.toLowerCase().startsWith('nl') ? 'nl' :
               acceptLang.toLowerCase().startsWith('ru') ? 'ru' :
               acceptLang.toLowerCase().startsWith('zh') ? 'zh' : 'en';

  const t = {
    fr: {
      title: 'Tell Me Something',
      subtitle: 'Messages anonymes, 100% gratuit',
      msgFor: 'Message pour',
      placeholder: 'Ecris ton message anonyme ici...',
      send: 'Envoyer anonymement 🚀',
      sending: 'Envoi...',
      secret: 'Ton identité reste secrète',
      createAccount: 'Créer mon compte',
      errorEmpty: 'Ecris un message !',
      errorSend: 'Erreur. Réessaie !',
      popupTitle: 'Message envoyé !',
      popupText: 'Ton identité reste complètement secrète. Personne ne saura que c\'est toi !',
      popupBtn: 'Envoyer un autre message',
      popupBtn2: 'Créer mon propre compte',
      suggestions: ['Dis-moi un secret 🤫','Décris-moi en 3 mots ✨','Ce que tu penses vraiment 👀','Une confession anonyme 🙈','Pose-moi une question 🎯','Tu m\'aimes ou tu me détestes ? ❤️'],
      dir: 'ltr'
    },
    en: {
      title: 'Tell Me Something',
      subtitle: 'Anonymous messages, 100% free',
      msgFor: 'Message for',
      placeholder: 'Write your anonymous message here...',
      send: 'Send anonymously 🚀',
      sending: 'Sending...',
      secret: 'Your identity stays secret',
      createAccount: 'Create my account',
      errorEmpty: 'Write a message first!',
      errorSend: 'Error. Try again!',
      popupTitle: 'Message sent!',
      popupText: 'Your identity is completely secret. Nobody will know it was you!',
      popupBtn: 'Send another message',
      popupBtn2: 'Create my own account',
      suggestions: ['Tell me a secret 🤫','Describe me in 3 words ✨','What you really think of me 👀','An anonymous confession 🙈','Ask me a question 🎯','Do you like me or hate me? ❤️'],
      dir: 'ltr'
    },
    ar: {
      title: 'Tell Me Something',
      subtitle: 'رسائل مجهولة، مجانية 100%',
      msgFor: 'رسالة إلى',
      placeholder: 'اكتب رسالتك المجهولة هنا...',
      send: 'إرسال بشكل مجهول 🚀',
      sending: 'جاري الإرسال...',
      secret: 'هويتك تبقى سرية',
      createAccount: 'إنشاء حسابي',
      errorEmpty: 'اكتب رسالة أولاً!',
      errorSend: 'خطأ. حاول مرة أخرى!',
      popupTitle: 'تم إرسال الرسالة!',
      popupText: 'هويتك سرية تماماً. لن يعرف أحد أنك أنت!',
      popupBtn: 'إرسال رسالة أخرى',
      popupBtn2: 'إنشاء حسابي الخاص',
      suggestions: ['أخبرني بسر 🤫','صفني بـ3 كلمات ✨','ما رأيك الحقيقي فيّ 👀','اعتراف مجهول 🙈','اسألني سؤالاً 🎯','تحبني أم تكرهني؟ ❤️'],
      dir: 'rtl'
    },
    es: {
      title: 'Tell Me Something',
      subtitle: 'Mensajes anónimos, 100% gratis',
      msgFor: 'Mensaje para',
      placeholder: 'Escribe tu mensaje anónimo aquí...',
      send: 'Enviar anónimamente 🚀',
      sending: 'Enviando...',
      secret: 'Tu identidad permanece secreta',
      createAccount: 'Crear mi cuenta',
      errorEmpty: '¡Escribe un mensaje!',
      errorSend: '¡Error. Inténtalo de nuevo!',
      popupTitle: '¡Mensaje enviado!',
      popupText: 'Tu identidad es completamente secreta.',
      popupBtn: 'Enviar otro mensaje',
      popupBtn2: 'Crear mi propia cuenta',
      suggestions: ['Dime un secreto 🤫','Descríbeme en 3 palabras ✨','Lo que realmente piensas 👀','Una confesión anónima 🙈','Hazme una pregunta 🎯','¿Me quieres o me odias? ❤️'],
      dir: 'ltr'
    }
  };

  const tx = t[lang] || t.fr;
  const isRTL = tx.dir === 'rtl';

  const html = `<!DOCTYPE html>
<html lang="${lang}" dir="${tx.dir}">
<head>
<meta name="google-adsense-account" content="ca-pub-9050682577442017">
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${tx.title} - @${cleanName}</title>
<meta property="og:title" content="Message anonyme pour @${cleanName}" />
<meta property="og:image" content="https://tell-me-something.pages.dev/og-image.png" />
<meta property="og:type" content="website" />
<meta name="twitter:card" content="summary_large_image" />
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"><\/script>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Segoe UI',sans-serif;background:#0a0a0a;color:#fff;min-height:100vh;display:flex;align-items:center;justify-content:center;direction:${tx.dir}}
.container{max-width:480px;width:100%;padding:30px 20px}
h1{font-size:1.8rem;text-align:center;margin-bottom:6px}
.subtitle{text-align:center;color:#888;margin-bottom:24px;font-size:14px}
.card{background:#1a1a1a;border-radius:16px;padding:24px}
.username{text-align:center;color:#00c853;font-size:1.1rem;font-weight:600;margin-bottom:16px}
.suggestions{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:16px}
.suggestion{background:#2a2a2a;border:1px solid #1a1a1a;border-radius:20px;padding:8px 14px;font-size:13px;cursor:pointer;color:#ccc;transition:all 0.2s}
.suggestion:hover{background:#00c853;color:#fff;border-color:#00c853}
textarea{width:100%;padding:14px;background:#2a2a2a;border:1px solid #1a1a1a;border-radius:10px;color:#fff;font-size:15px;margin-bottom:8px;outline:none;resize:none;font-family:inherit;direction:${tx.dir}}
textarea:focus{border-color:#00c853}
.counter{text-align:${isRTL ? 'left' : 'right'};font-size:12px;color:#666;margin-bottom:14px}
button.send{width:100%;padding:14px;background:#00c853;color:#fff;border:none;border-radius:10px;font-size:16px;cursor:pointer;font-weight:600}
button.send:hover{background:#00a846}
button.send:disabled{background:#444;cursor:not-allowed}
.alert{padding:12px;border-radius:8px;margin-bottom:14px;font-size:14px}
.alert-success{background:#014d26;color:#69f0ae}
.alert-error{background:#450a0a;color:#fca5a5}
.footer{text-align:center;margin-top:16px;font-size:12px;color:#555}
.footer a{color:#00c853;text-decoration:none}
.popup-overlay{display:none;position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.8);z-index:100;align-items:center;justify-content:center}
.popup-overlay.active{display:flex}
.popup{background:#1a1a1a;border-radius:20px;padding:30px;max-width:380px;width:90%;text-align:center;animation:popIn 0.3s ease}
@keyframes popIn{from{transform:scale(0.8);opacity:0}to{transform:scale(1);opacity:1}}
.popup-emoji{font-size:60px;margin-bottom:16px}
.popup h2{font-size:1.4rem;margin-bottom:8px}
.popup p{color:#888;margin-bottom:20px;font-size:14px}
.popup-btn{width:100%;padding:14px;background:#00c853;color:#fff;border:none;border-radius:10px;font-size:16px;cursor:pointer;font-weight:600;margin-bottom:10px}
.popup-btn2{width:100%;padding:12px;background:#2a2a2a;color:#ccc;border:none;border-radius:10px;font-size:14px;cursor:pointer}
</style>
</head>
<body>
<div class="container">
  <h1><a href="/app/" style="color:#fff;text-decoration:none;">🐱‍👤 ${tx.title}</a></h1>
  <p class="subtitle">${tx.subtitle}</p>
  <div class="card">
    <div class="username"><a href="/app/profile/?u=${cleanName}" style="color:#00c853;text-decoration:none;">${tx.msgFor} @${cleanName}</a></div>
    <div id="alertBox"></div>
    <div class="suggestions">
      ${tx.suggestions.map(s => `<span class="suggestion" onclick="useSuggestion(this)">${s}</span>`).join('')}
    </div>
    <textarea id="messageText" rows="5" maxlength="500" placeholder="${tx.placeholder}" oninput="document.getElementById('counter').textContent=this.value.length"></textarea>
    <div class="counter"><span id="counter">0</span>/500</div>
    <button class="send" id="sendBtn" onclick="sendMessage()">${tx.send}</button>
  </div>
  <div class="footer">
    <p>${tx.secret} • <a href="/app/">${tx.createAccount}</a></p>
  </div>
</div>

<div class="popup-overlay" id="popup">
  <div class="popup">
    <div class="popup-emoji">🎉</div>
    <h2>${tx.popupTitle}</h2>
    <p>${tx.popupText}</p>
    <button class="popup-btn" onclick="closePopup()">${tx.popupBtn}</button>
    <button class="popup-btn2" onclick="window.location.href='/app/'">${tx.popupBtn2}</button>
  </div>
</div>

<script>
const SUPABASE_URL='https://bcnchlfbbbgkrqctlyrz.supabase.co';
const SUPABASE_KEY='sb_publishable_Tvd6E1mW4OYLeIuuIpWeyw_tcntyeLb';
const sb=supabase.createClient(SUPABASE_URL,SUPABASE_KEY);
const username='${cleanName}';

function useSuggestion(el){
  document.getElementById('messageText').value=el.textContent.trim();
  document.getElementById('counter').textContent=el.textContent.trim().length;
  document.getElementById('messageText').focus();
}

async function sendMessage(){
  const content=document.getElementById('messageText').value.trim();
  const alertBox=document.getElementById('alertBox');
  const btn=document.getElementById('sendBtn');
  if(!content){alertBox.innerHTML='<div class="alert alert-error">${tx.errorEmpty}</div>';return;}
  btn.disabled=true;btn.textContent='${tx.sending}';
  const{error}=await sb.from('messages').insert({recipient_username:username,content:content});
  if(!error){
    fetch('/notify',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({recipient_username:username,message:content})
    });
  }
  if(error){
    alertBox.innerHTML='<div class="alert alert-error">${tx.errorSend}</div>';
    btn.disabled=false;btn.textContent='${tx.send}';
  }else{
    alertBox.innerHTML='';
    document.getElementById('messageText').value='';
    document.getElementById('counter').textContent='0';
    btn.disabled=false;btn.textContent='${tx.send}';
    document.getElementById('popup').classList.add('active');
  }
}

function closePopup(){
  document.getElementById('popup').classList.remove('active');
}
<\/script>
</body>
</html>`;

  return new Response(html, {
    headers: {'Content-Type': 'text/html;charset=UTF-8'}
  });
}