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
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>@${cleanName} - Tell Me Something</title>
<meta property="og:title" content="Send an anonymous message to @${cleanName}!" />
<meta property="og:description" content="Click to send a secret message to @${cleanName}. Your identity stays hidden!" />
<meta property="og:image" content="https://tell-me-something.pages.dev/og-image.png" />
<meta property="og:type" content="website" />
<meta name="twitter:card" content="summary_large_image" />
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"><\/script>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Segoe UI',sans-serif;background:#0a0a0a;color:#fff;min-height:100vh;display:flex;align-items:center;justify-content:center}
.container{max-width:480px;width:100%;padding:30px 20px;text-align:center}
.logo{width:80px;height:80px;margin:0 auto 16px}
.logo img{width:100%;height:100%;object-fit:contain}
.avatar{width:100px;height:100px;background:#00c853;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:40px;font-weight:700;color:#fff;margin:0 auto 16px}
.username{font-size:1.6rem;font-weight:700;color:#fff;margin-bottom:6px}
.handle{font-size:14px;color:#00c853;margin-bottom:24px}
.stats{display:flex;gap:16px;justify-content:center;margin-bottom:30px}
.stat{background:#1a1a1a;border-radius:12px;padding:16px 24px;text-align:center}
.stat-num{font-size:1.8rem;font-weight:700;color:#00c853}
.stat-label{font-size:12px;color:#888;margin-top:4px}
.card{background:#1a1a1a;border-radius:16px;padding:24px;margin-bottom:16px;text-align:left}
.suggestions{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:16px}
.suggestion{background:#2a2a2a;border:1px solid #333;border-radius:20px;padding:8px 14px;font-size:13px;cursor:pointer;color:#ccc;transition:all 0.2s}
.suggestion:hover{background:#00c853;color:#fff;border-color:#00c853}
textarea{width:100%;padding:14px;background:#2a2a2a;border:1px solid #333;border-radius:10px;color:#fff;font-size:15px;margin-bottom:8px;outline:none;resize:none;font-family:inherit}
textarea:focus{border-color:#00c853}
.counter{text-align:right;font-size:12px;color:#666;margin-bottom:14px}
button.send{width:100%;padding:14px;background:#00c853;color:#fff;border:none;border-radius:10px;font-size:16px;cursor:pointer;font-weight:600}
button.send:hover{background:#00a846}
button.send:disabled{background:#444;cursor:not-allowed}
.alert{padding:12px;border-radius:8px;margin-bottom:14px;font-size:14px}
.alert-success{background:#064e3b;color:#6ee7b7}
.alert-error{background:#450a0a;color:#fca5a5}
.footer{text-align:center;margin-top:20px;font-size:12px;color:#555}
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
  <div class="logo"><img src="/tms-logo.png" alt="TMS"></div>
  <div class="avatar">${cleanName.charAt(0).toUpperCase()}</div>
  <div class="username">@${cleanName}</div>
  <div class="handle">Tell Me Something</div>
  
  <div class="stats">
    <div class="stat">
      <div class="stat-num" id="msgCount">...</div>
      <div class="stat-label">Messages</div>
    </div>
    <div class="stat">
      <div class="stat-num">👁️</div>
      <div class="stat-label">Anonymous</div>
    </div>
  </div>

  <div class="card">
    <div id="alertBox"></div>
    <div class="suggestions">
      <span class="suggestion" onclick="useSuggestion(this)">Tell me a secret 🤫</span>
      <span class="suggestion" onclick="useSuggestion(this)">Describe me in 3 words ✨</span>
      <span class="suggestion" onclick="useSuggestion(this)">What you really think 👀</span>
      <span class="suggestion" onclick="useSuggestion(this)">Ask me anything 🎯</span>
    </div>
    <textarea id="messageText" rows="4" maxlength="500" placeholder="Send an anonymous message..." oninput="document.getElementById('counter').textContent=this.value.length"></textarea>
    <div class="counter"><span id="counter">0</span>/500</div>
    <button class="send" id="sendBtn" onclick="sendMessage()">Send anonymously 🚀</button>
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