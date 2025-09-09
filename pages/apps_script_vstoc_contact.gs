// ====== VSTOC Contact Endpoint (Google Apps Script) ======
// Paste this into https://script.google.com as a new project, set the Sheet ID & deploy as Web App.

/** ====== CONFIG ====== */
const SHEET_ID = '1p4NERpQ6kXTPu16JV2juuofxpLH5OgVTpnnCejlfmDw';              // Google Sheet ID (from URL)
const SHEET_NAME = 'Contacts';               // Sheet tab name (created if missing)
const SUPPORT_EMAIL = 'vinhcb.path@gmail.com';     // Your support inbox
const SEND_COPY_TO_SENDER = true;            // Auto-reply to sender? true/false

/** ====== ENTRYPOINTS ====== */
function doGet(e) {
  return _json({ ok: true, service: 'vstoc-contact', time: new Date() });
}

function doPost(e) {
  try {
    const p = (e && e.parameter) || {};
    if ((p._gotcha || '').trim() !== '') return _json({ ok: true, skipped: 'bot' }); // Honeypot

    const name = _s(p.name);
    const email = _s(p.email);
    const message = _s(p.message);
    if (!name || !email || !message) return _json({ ok: false, error: 'missing_fields' });

    const sh = _openSheet(SHEET_ID, SHEET_NAME);
    const row = [
      new Date(),
      name,
      email,
      _s(p.phone),
      _s(p.company),
      _s(p.topic),
      message,
      _s(p.ua),
      _s(p.referer),
    ];
    sh.appendRow(row);

    const subject = `VSTOC Contact • ${_s(p.topic) || 'Khác'} • ${name}`;
    const body =
`Thông tin liên hệ mới:

Họ tên: ${name}
Email: ${email}
Điện thoại: ${_s(p.phone)}
Công ty: ${_s(p.company)}
Chủ đề: ${_s(p.topic)}

Nội dung:
${message}

---
UA: ${_s(p.ua)}
Ref: ${_s(p.referer)}
Thời gian: ${new Date().toLocaleString('vi-VN')}`;

    GmailApp.sendEmail(SUPPORT_EMAIL, subject, body, { replyTo: email, name: 'VSTOC Website' });

    if (SEND_COPY_TO_SENDER && email) {
      const ack =
`Chào ${name},

Chúng tôi đã nhận được yêu cầu liên hệ của bạn và sẽ phản hồi trong 1–2 ngày làm việc.
Tóm tắt:
- Chủ đề: ${_s(p.topic)}
- Nội dung: ${message}

Trân trọng,
VSTOC Support
vinhcb.path@gmail.com`;
      GmailApp.sendEmail(email, 'Đã nhận yêu cầu – VSTOC', ack, { name: 'VSTOC Support' });
    }

    return _json({ ok: true });
  } catch (err) {
    return _json({ ok: false, error: String(err) });
  }
}

/** ====== HELPERS ====== */
function _openSheet(id, name) {
  const ss = SpreadsheetApp.openById(id);
  let sh = ss.getSheetByName(name);
  if (!sh) {
    sh = ss.insertSheet(name);
    sh.appendRow(['timestamp','name','email','phone','company','topic','message','ua','referer']);
  }
  return sh;
}
function _json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
function _s(v){ return (v || '').toString().trim(); }
