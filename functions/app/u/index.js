export async function onRequest(context) {
  const url = new URL(context.request.url);
  const username = url.searchParams.get('u') || '';
  const cleanName = username.replace(/[^a-zA-Z0-9_-]/g, '');

  if (!cleanName) {
    return Response.redirect('https://tell-me-something.pages.dev/app/', 302);
  }

  const html = `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Message anonyme pour @${cleanName}</title>
<meta property="og:title" content="Envoie un message anonyme a @${cleanName} !" />
<meta property="og:description" content="Clique pour envoyer un message secret. Ton identite restera cachee !" />
<meta property="og:image" content="https://tell-me-something.pages.dev/og-image.png" />
<meta property="og:type" content="website" />
<meta name="twitter:card" content="summary_large_image" />
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"><\/script>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Segoe UI',sans-serif;background:#0a0a0a;color:#fff;min-height:100vh;display:flex;align-items:center;justify-content:center}
.container{max-width:480px;width:100%;padding:30px 20px}
h1{font-size:1.8rem;text-align:center;margin-bottom:6px}
.subtitle{text-align:center;color:#888;margin-bottom:24px;font-size:14px}
.card{background:#1a1a1a;border-radius:16px;padding:24px}
.username{text-align:center;color:#6366f1;font-size:1.1rem;font-weight:600;margin-bottom:16px}
.suggestions{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:16px}
.suggestion{background:#2a2a2a;border:1px solid #333;border-radius:20px;padding:8px 14px;font-size:13px;cursor:pointer;color:#ccc;transition:all 0.2s}
.suggestion:hover{background:#6366f1;color:#fff;border-color:#6366f1}
textarea{width:100%;padding:14px;background:#2a2a2a;border:1px solid #333;border-radius:10px;color:#fff;font-size:15px;margin-bottom:8px;outline:none;resize:none;font-family:inherit}
textarea:focus{border-color:#6366f1}
.counter{text-align:right;font-size:12px;color:#666;margin-bottom:14px}
button.send{width:100%;padding:14px;background:#6366f1;color:#fff;border:none;border-radius:10px;font-size:16px;cursor:pointer;font-weight:600}
button.send:hover{background:#4f46e5}
button.send:disabled{background:#444;cursor:not-allowed}
.alert{padding:12px;border-radius:8px;margin-bottom:14px;font-size:14px}
.alert-success{background:#064e3b;color:#6ee7b7}
.alert-error{background:#450a0a;color:#fca5a5}
.footer{text-align:center;margin-top:16px;font-size:12px;color:#555}
.footer a{color:#6366f1;text-decoration:none}
.popup-overlay{display:none;position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.8);z-index:100;align-items:center;justify-content:center}
.popup-overlay.active{display:flex}
.popup{background:#1a1a1a;border-radius:20px;padding:30px;max-width:380px;width:90%;text-align:center;animation:popIn 0.3s ease}
@keyframes popIn{from{transform:scale(0.8);opacity:0}to{transform:scale(1);opacity:1}}
.popup-emoji{font-size:60px;margin-bottom:16px}
.popup h2{font-size:1.4rem;margin-bottom:8px}
.popup p{color:#888;margin-bottom:20px;font-size:14px}
.popup-btn{width:100%;padding:14px;background:#6366f1;color:#fff;border:none;border-radius:10px;font-size:16px;cursor:pointer;font-weight:600;margin-bottom:10px}
.popup-btn2{width:100%;padding:12px;background:#2a2a2a;color:#ccc;border:none;border-radius:10px;font-size:14px;cursor:pointer}
</style>
</head>
<body>
<div class="container">
  <h1>👁️ Tell Me Something</h1>
  <p class="subtitle">Messages anonymes, 100% gratuit</p>
  <div class="card">
    <div class="username">Message pour @${cleanName}</div>
    <div id="alertBox"></div>
    <div class="suggestions">
      <span class="suggestion" onclick="useSuggestion(this)">Dis-moi un secret 🤫</span>
      <span class="suggestion" onclick="useSuggestion(this)">Décris-moi en 3 mots ✨</span>
      <span class="suggestion" onclick="useSuggestion(this)">Ce que tu penses vraiment 👀</span>
      <span class="suggestion" onclick="useSuggestion(this)">Une confession anonyme 🙈</span>
      <span class="suggestion" onclick="useSuggestion(this)">Pose-moi une question 🎯</span>
      <span class="suggestion" onclick="useSuggestion(this)">Tu m'aimes ou tu me détestes ? ❤️</span>
    </div>
    <textarea id="messageText" rows="5" maxlength="500" placeholder="Ecris ton message anonyme ici..." oninput="document.getElementById('counter').textContent=this.value.length"></textarea>
    <div class="counter"><span id="counter">0</span>/500</div>
    <button class="send" id="sendBtn" onclick="sendMessage()">Envoyer anonymement 🚀</button>
  </div>
  <div class="footer">
    <p>Ton identité reste secrète • <a href="/app/">Créer mon compte</a></p>
  </div>
</div>

<div class="popup-overlay" id="popup">
  <div class="popup">
    <div class="popup-emoji">🎉</div>
    <h2>Message envoyé !</h2>
    <p>Ton identité reste complètement secrète.<br>Personne ne saura que c'est toi !</p>
    <button class="popup-btn" onclick="closePopup()">Envoyer un autre message</button>
    <button class="popup-btn2" onclick="window.location.href='/app/'">Créer mon propre compte</button>
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
  if(!content){alertBox.innerHTML='<div class="alert alert-error">Ecris un message !</div>';return;}
  btn.disabled=true;btn.textContent='Envoi...';
  const{error}=await sb.from('messages').insert({recipient_username:username,content:content});
  if(error){
    alertBox.innerHTML='<div class="alert alert-error">Erreur. Réessaie !</div>';
    btn.disabled=false;btn.textContent='Envoyer anonymement 🚀';
  }else{
    alertBox.innerHTML='';
    document.getElementById('messageText').value='';
    document.getElementById('counter').textContent='0';
    btn.disabled=false;btn.textContent='Envoyer anonymement 🚀';
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