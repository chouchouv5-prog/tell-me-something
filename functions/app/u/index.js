export async function onRequest(context) {
  const url = new URL(context.request.url);
  const username = url.searchParams.get('u') || '';
  const cleanName = username.replace(/[^a-zA-Z0-9_-]/g, '');

  if (!cleanName) {
    return Response.redirect('https://tell-me-something.pages.dev/app/', 302);
  }

  const acceptLang = context.request.headers.get('Accept-Language') || 'en';
  const lang = acceptLang.toLowerCase().startsWith('ar') ? 'ar' :
               acceptLang.toLowerCase().startsWith('fr') ? 'fr' :
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

  const tx = t[lang] || t.en;
  const isRTL = tx.dir === 'rtl';

  const html = `<!DOCTYPE html>
<html lang="${lang}" dir="${tx.dir}">
<head>
<meta name="google-adsense-account" content="ca-pub-9050682577442017">
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${tx.title} - @${cleanName}</title>
<meta property="og:title" content="Send an anonymous message to @${cleanName}!" />
<meta property="og:description" content="Send me an anonymous message... I dare you 🤫 Nobody will know it was you!" />
<meta property="og:image" content="https://tell-me-something.pages.dev/og-image.png" />
<meta property="og:type" content="website" />
<meta name="twitter:card" content="summary_large_image" />
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"><\/script>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Segoe UI',sans-serif;background:#0a0a0a;color:#fff;min-height:100vh;direction:${tx.dir}}

/* NAV */
nav{display:flex;align-items:center;justify-content:space-between;padding:14px 24px;background:rgba(0,0,0,0.95);border-bottom:2px solid #00c853}
.nav-logo{display:flex;align-items:center;gap:10px;text-decoration:none;color:#fff;font-size:1.1rem;font-weight:700}
.nav-logo img{height:42px}
.btn-nav{background:linear-gradient(135deg,#00c853,#ffd600);color:#000;padding:8px 18px;border-radius:8px;font-weight:700;text-decoration:none;font-size:14px}

/* HERO */
.page-hero{text-align:center;padding:40px 20px 30px;background:linear-gradient(180deg,#0a0a0a 0%,#0d1f0d 100%)}
.hero-badge{display:inline-block;background:linear-gradient(135deg,#00c853,#ffd600);color:#000;padding:7px 18px;border-radius:20px;font-size:12px;font-weight:700;margin-bottom:16px;letter-spacing:1px}
.avatar{width:90px;height:90px;background:linear-gradient(135deg,#00c853,#00a846);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:36px;font-weight:800;color:#fff;margin:0 auto 14px;box-shadow:0 4px 20px rgba(0,200,83,0.4)}
.username{font-size:1.5rem;font-weight:800;margin-bottom:4px}
.handle{font-size:14px;color:#00c853;margin-bottom:20px}
.stats-row{display:flex;gap:12px;justify-content:center;margin-bottom:10px}
.stat-pill{background:#111;border:1px solid #1f2e1f;border-radius:12px;padding:14px 22px;text-align:center}
.stat-num{font-size:1.6rem;font-weight:800;background:linear-gradient(135deg,#00c853,#ffd600);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.stat-label{font-size:11px;color:#666;margin-top:2px;text-transform:uppercase;letter-spacing:0.5px}

/* CARD */
.container{max-width:480px;width:100%;margin:0 auto;padding:20px 16px 40px}
.card{background:#111;border-radius:16px;padding:24px;margin-bottom:16px;border:1px solid #1f2e1f}
.suggestions{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:16px}
.suggestion{background:#1a1a1a;border:1px solid #1f2e1f;border-radius:20px;padding:8px 14px;font-size:13px;cursor:pointer;color:#aaa;transition:all 0.2s}
.suggestion:hover{background:#00c853;color:#fff;border-color:#00c853}
textarea{width:100%;padding:14px;background:#1a1a1a;border:1px solid #1f2e1f;border-radius:10px;color:#fff;font-size:15px;margin-bottom:8px;outline:none;resize:none;font-family:inherit;direction:${tx.dir}}
textarea:focus{border-color:#00c853}
.counter{text-align:${isRTL ? 'left' : 'right'};font-size:12px;color:#555;margin-bottom:14px}
.btn-send{width:100%;padding:14px;background:linear-gradient(135deg,#00c853,#00a846);color:#fff;border:none;border-radius:10px;font-size:16px;cursor:pointer;font-weight:700;box-shadow:0 4px 16px rgba(0,200,83,0.35);transition:transform 0.2s}
.btn-send:hover{transform:translateY(-1px)}
.btn-send:disabled{background:#333;box-shadow:none;cursor:not-allowed}
.alert{padding:12px;border-radius:8px;margin-bottom:14px;font-size:14px}
.alert-error{background:#2e0a0a;color:#fca5a5;border:1px solid #ff4444}
.footer{text-align:center;margin-top:16px;font-size:12px;color:#444}
.footer a{color:#00c853;text-decoration:none}
.footer a:hover{color:#ffd600}

/* POPUP */
.popup-overlay{display:none;position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.85);z-index:100;align-items:center;justify-content:center}
.popup-overlay.active{display:flex}
.popup{background:#111;border:1px solid #1f2e1f;border-radius:20px;padding:30px;max-width:380px;width:90%;text-align:center;animation:popIn 0.3s ease}
@keyframes popIn{from{transform:scale(0.8);opacity:0}to{transform:scale(1);opacity:1}}
.popup-emoji{font-size:60px;margin-bottom:16px}
.popup h2{font-size:1.4rem;margin-bottom:8px}
.popup p{color:#888;margin-bottom:20px;font-size:14px}
.popup-btn{width:100%;padding:14px;background:linear-gradient(135deg,#00c853,#00a846);color:#fff;border:none;border-radius:10px;font-size:16px;cursor:pointer;font-weight:700;margin-bottom:10px;box-shadow:0 4px 16px rgba(0,200,83,0.3)}
.popup-btn2{width:100%;padding:12px;background:#1a1a1a;color:#888;border:1px solid #1f2e1f;border-radius:10px;font-size:14px;cursor:pointer;font-weight:600}
</style>
</head>
<body>

<nav>
  <a class="nav-logo" href="/app/"><img src="/tms-logo.png" alt="TMS"> TMS</a>
  <a href="/app/" class="btn-nav">+ My account</a>
</nav>

<div class="page-hero">
  <div class="hero-badge">🐱‍👤 100% ANONYMOUS</div>
  <div class="avatar">${cleanName.charAt(0).toUpperCase()}</div>
  <div class="username">@${cleanName}</div>
  <div class="handle"><a href="/app/" style="color:#00c853;text-decoration:none">${tx.title}</a></div>
  <div class="stats-row">
    <div class="stat-pill"><div class="stat-num" id="msgCount">...</div><div class="stat-label">Messages</div></div>
    <div class="stat-pill"><div class="stat-num">🐱‍👤</div><div class="stat-label">Anonymous</div></div>
  </div>
</div>

<div class="container">
  <div class="card">
    <div id="alertBox"></div>
    <div class="suggestions">
      ${tx.suggestions.map(s => `<span class="suggestion" onclick="useSuggestion(this)">${s}</span>`).join('')}
    </div>
    <textarea id="messageText" rows="5" maxlength="500" placeholder="${tx.placeholder}" oninput="document.getElementById('counter').textContent=this.value.length"></textarea>
    <div class="counter"><span id="counter">0</span>/500</div>
    <button class="btn-send" id="sendBtn" onclick="sendMessage()">${tx.send}</button>
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

sb.from('messages').select('id',{count:'exact'}).eq('recipient_username',username).then(({count})=>{
  document.getElementById('msgCount').textContent=count||0;
});

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
  if(error){
    alertBox.innerHTML='<div class="alert alert-error">${tx.errorSend}</div>';
    btn.disabled=false;btn.textContent='${tx.send}';
  }else{
    fetch('/notify',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({recipient_username:username,message:content})});
    alertBox.innerHTML='';
    document.getElementById('messageText').value='';
    document.getElementById('counter').textContent='0';
    btn.disabled=false;btn.textContent='${tx.send}';
    document.getElementById('popup').classList.add('active');
  }
}

function closePopup(){document.getElementById('popup').classList.remove('active');}
<\/script>
</body>
</html>`;

  return new Response(html, {
    headers: {'Content-Type': 'text/html;charset=UTF-8'}
  });
}