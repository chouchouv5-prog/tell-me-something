export async function onRequest(context) {
  const url = new URL(context.request.url);
  const username = url.searchParams.get('u') || '';
  const cleanName = username.replace(/[^a-zA-Z0-9_-]/g, '');

  if (!cleanName) {
    return Response.redirect('https://tell-me-something.pages.dev/app/', 302);
  }

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta name="google-adsense-account" content="ca-pub-9050682577442017">
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>@${cleanName} - Tell Me Something</title>
<meta property="og:title" content="Send an anonymous message to @${cleanName}!" />
<meta property="og:description" content="Send me an anonymous message... I dare you 🤫 Nobody will know it was you!" />
<meta name="twitter:title" content="Send @${cleanName} an anonymous message 🐱‍👤" />
<meta name="twitter:description" content="Nobody will know it was you 🤫" />
<meta name="twitter:image" content="https://tell-me-something.pages.dev/og-image.png" />
<meta property="og:image" content="https://tell-me-something.pages.dev/og-image.png" />
<meta property="og:type" content="website" />
<meta name="twitter:card" content="summary_large_image" />
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"><\/script>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Segoe UI',sans-serif;background:#0a0a0a;color:#fff;min-height:100vh}

/* NAV */
nav{display:flex;align-items:center;justify-content:space-between;padding:14px 24px;background:rgba(0,0,0,0.95);border-bottom:2px solid #00c853}
.nav-logo{display:flex;align-items:center;gap:10px;text-decoration:none;color:#fff;font-size:1.1rem;font-weight:700}
.nav-logo img{height:42px}
.btn-nav{background:linear-gradient(135deg,#00c853,#ffd600);color:#000;padding:8px 18px;border-radius:8px;font-weight:700;text-decoration:none;font-size:14px}

/* HERO PROFILE */
.profile-hero{text-align:center;padding:50px 20px 40px;background:linear-gradient(180deg,#0a0a0a 0%,#0d1f0d 100%)}
.hero-badge{display:inline-block;background:linear-gradient(135deg,#00c853,#ffd600);color:#000;padding:7px 18px;border-radius:20px;font-size:12px;font-weight:700;margin-bottom:20px;letter-spacing:1px}
.avatar{width:100px;height:100px;background:linear-gradient(135deg,#00c853,#00a846);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:40px;font-weight:800;color:#fff;margin:0 auto 16px;box-shadow:0 4px 24px rgba(0,200,83,0.4)}
.username{font-size:1.7rem;font-weight:800;margin-bottom:6px}
.handle{font-size:14px;color:#00c853;margin-bottom:28px}
.stats-row{display:flex;gap:12px;justify-content:center;flex-wrap:wrap}
.stat-pill{background:#111;border:1px solid #1f2e1f;border-radius:14px;padding:16px 28px;text-align:center;min-width:120px}
.stat-num{font-size:1.8rem;font-weight:800;background:linear-gradient(135deg,#00c853,#ffd600);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.stat-label{font-size:11px;color:#666;margin-top:4px;text-transform:uppercase;letter-spacing:0.5px}

/* CARD */
.container{max-width:480px;width:100%;margin:0 auto;padding:30px 16px 50px}
.card{background:#111;border-radius:16px;padding:24px;margin-bottom:16px;border:1px solid #1f2e1f}
.suggestions{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:16px}
.suggestion{background:#1a1a1a;border:1px solid #1f2e1f;border-radius:20px;padding:8px 14px;font-size:13px;cursor:pointer;color:#aaa;transition:all 0.2s}
.suggestion:hover{background:#00c853;color:#fff;border-color:#00c853}
textarea{width:100%;padding:14px;background:#1a1a1a;border:1px solid #1f2e1f;border-radius:10px;color:#fff;font-size:15px;margin-bottom:8px;outline:none;resize:none;font-family:inherit}
textarea:focus{border-color:#00c853}
.counter{text-align:right;font-size:12px;color:#555;margin-bottom:14px}
.btn-send{width:100%;padding:14px;background:linear-gradient(135deg,#00c853,#00a846);color:#fff;border:none;border-radius:10px;font-size:16px;cursor:pointer;font-weight:700;box-shadow:0 4px 16px rgba(0,200,83,0.35);transition:transform 0.2s}
.btn-send:hover{transform:translateY(-1px)}
.btn-send:disabled{background:#333;box-shadow:none;cursor:not-allowed}
.alert{padding:12px;border-radius:8px;margin-bottom:14px;font-size:14px}
.alert-success{background:#0a2e1a;color:#69f0ae;border:1px solid #00c853}
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
  <a class="nav-logo" href="/"><img src="/tms-logo.png" alt="TMS"> TMS</a>
  <a href="/app/" class="btn-nav">My account 🐱‍👤</a>
</nav>

<div class="profile-hero">
  <div class="hero-badge">🐱‍👤 SEND ANONYMOUSLY</div>
  <div class="avatar">${cleanName.charAt(0).toUpperCase()}</div>
  <div class="username">@${cleanName}</div>
  <div class="handle"><a href="/app/" style="color:#00c853;text-decoration:none">Tell Me Something</a></div>
  <div class="stats-row">
    <div class="stat-pill"><div class="stat-num" id="msgCount">...</div><div class="stat-label">Messages</div></div>
    <div class="stat-pill"><div class="stat-num">🐱‍👤</div><div class="stat-label">Anonymous</div></div>
  </div>
</div>

<div class="container">
  <div class="card">
    <div id="alertBox"></div>
    <div class="suggestions">
      <span class="suggestion" onclick="useSuggestion(this)">Tell me a secret 🤫</span>
      <span class="suggestion" onclick="useSuggestion(this)">Describe me in 3 words ✨</span>
      <span class="suggestion" onclick="useSuggestion(this)">What you really think 👀</span>
      <span class="suggestion" onclick="useSuggestion(this)">Ask me anything 🎯</span>
    </div>
    <textarea id="messageText" rows="5" maxlength="500" placeholder="Send an anonymous message..." oninput="document.getElementById('counter').textContent=this.value.length"></textarea>
    <div class="counter"><span id="counter">0</span>/500</div>
    <button class="btn-send" id="sendBtn" onclick="sendMessage()">Send anonymously 🚀</button>
  </div>
  <div class="footer">
    <p>Your identity stays secret • <a href="/app/">Create my account</a></p>
  </div>
</div>

<div class="popup-overlay" id="popup">
  <div class="popup">
    <div class="popup-emoji">🎉</div>
    <h2>Message sent!</h2>
    <p>Your identity is completely secret.<br>Nobody will know it was you!</p>
    <button class="popup-btn" onclick="closePopup()">Send another message</button>
    <button class="popup-btn2" onclick="window.location.href='/app/'">Create my own account</button>
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
  if(!content){alertBox.innerHTML='<div class="alert alert-error">Write a message first!</div>';return;}
  btn.disabled=true;btn.textContent='Sending...';
  const{error}=await sb.from('messages').insert({recipient_username:username,content:content});
  if(error){
    alertBox.innerHTML='<div class="alert alert-error">Error. Try again!</div>';
    btn.disabled=false;btn.textContent='Send anonymously 🚀';
  }else{
    fetch('/notify',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({recipient_username:username,message:content})});
    alertBox.innerHTML='';
    document.getElementById('messageText').value='';
    document.getElementById('counter').textContent='0';
    btn.disabled=false;btn.textContent='Send anonymously 🚀';
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