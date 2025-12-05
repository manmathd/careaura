/* login.js — Demo OTP flow (client-only). Replace with server-side OTP for production. */
const USER_KEY = 'care_user';
let generatedOTP = null;
let otpExpiresAt = 0;
let otpTimer = null;
const OTP_TTL_MS = 3 * 60 * 1000; // 3 minutes

function $(id){ return document.getElementById(id); }
function showToast(msg, ms = 2500) {
  const t = $('toast');
  if(!t) return;
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(t._timer);
  t._timer = setTimeout(()=> t.classList.remove('show'), ms);
}

/* Basic validation for 10-digit Indian mobile */
function validMobile(m) { return /^\d{10}$/.test(m); }

function randomOTP() { return Math.floor(1000 + Math.random() * 9000).toString(); }

function sendOTP(e){
  if(e) e.preventDefault();
  const name = $('name').value.trim();
  const mobile = $('mobile').value.trim();

  if (!name) { showToast('Please enter your name'); $('name').focus(); return; }
  if (!validMobile(mobile)) { showToast('Enter a valid 10-digit mobile number'); $('mobile').focus(); return; }

  generatedOTP = randomOTP();
  otpExpiresAt = Date.now() + OTP_TTL_MS;
  console.info('CareAura demo OTP (dev only):', generatedOTP); // dev-only

  // show OTP section
  $('otpSection').style.display = 'block';
  $('otpSection').setAttribute('aria-hidden', 'false');
  $('otpInfo').textContent = `OTP valid for 3 minutes.`;
  showToast(`OTP sent to +91-${mobile} (demo)`);

  // start countdown visual in otpInfo
  clearInterval(otpTimer);
  otpTimer = setInterval(() => {
    const left = Math.max(0, Math.ceil((otpExpiresAt - Date.now()) / 1000));
    if (left <= 0) {
      clearInterval(otpTimer);
      $('otpInfo').textContent = 'OTP expired. Click Resend to get a new one.';
      generatedOTP = null;
    } else {
      $('otpInfo').textContent = `OTP valid for ${Math.ceil(left/60)}:${String(left%60).padStart(2,'0')} (mm:ss)`;
    }
  }, 1000);
}

function resendOTP(){
  // clear old OTP and generate new
  generatedOTP = randomOTP();
  otpExpiresAt = Date.now() + OTP_TTL_MS;
  console.info('CareAura demo OTP (resend):', generatedOTP);
  showToast('OTP resent (demo)');
  $('otpSection').style.display = 'block';
  $('otpSection').setAttribute('aria-hidden', 'false');
}

/* Verify and store username, then redirect to app.html */
function verifyOTP(){
  const entered = $('otp').value.trim();
  if (!generatedOTP) { showToast('Please request an OTP first'); return; }
  if (Date.now() > otpExpiresAt) { generatedOTP = null; showToast('OTP expired — request again'); return; }
  if (entered === generatedOTP) {
    const name = $('name').value.trim();
    localStorage.setItem(USER_KEY, name || 'Guest');
    showToast('Verified — redirecting...', 1200);
    setTimeout(()=> { window.location.href = 'app.html'; }, 900);
  } else {
    showToast('Incorrect OTP. Try again');
  }
}

/* small UX: pressing Enter in OTP field triggers verify */
document.addEventListener('DOMContentLoaded', () => {
  const otpInput = $('otp');
  if (otpInput) {
    otpInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') { e.preventDefault(); verifyOTP(); }
    });
  }
});
