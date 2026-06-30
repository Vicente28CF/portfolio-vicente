import asyncio
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

from app.config import settings

REASON_LABELS = {
    "job": "💼 Propuesta de trabajo",
    "project": "🚀 Propuesta de proyecto",
    "other": "✉️ Otro",
}


def _build_html(name: str, email: str, reason: str, message: str) -> str:
    reason_label = REASON_LABELS.get(reason, reason)
    return f"""\
<table cellpadding="0" cellspacing="0" style="font-family:Arial,sans-serif;font-size:14px;color:#333;max-width:560px;margin:0 auto">
  <tr>
    <td style="background:#1a1a2e;color:#fff;padding:20px 24px;border-radius:8px 8px 0 0;font-size:20px;font-weight:bold">
      ✉️ {reason_label}
    </td>
  </tr>
  <tr>
    <td style="background:#fff;padding:24px;border:1px solid #e0e0e0;border-top:0;border-radius:0 0 8px 8px">
      <table cellpadding="0" cellspacing="0" style="width:100%">
        <tr><td style="padding:6px 0"><strong style="color:#1a1a2e">Nombre</strong><br>{name}</td></tr>
        <tr><td style="padding:6px 0"><strong style="color:#1a1a2e">Email</strong><br><a href="mailto:{email}" style="color:#2563eb;text-decoration:none">{email}</a></td></tr>
        <tr><td style="padding:6px 0"><strong style="color:#1a1a2e">Motivo</strong><br>{reason_label}</td></tr>
        <tr><td style="padding:6px 0"><strong style="color:#1a1a2e">Mensaje</strong><br>{message}</td></tr>
      </table>
    </td>
  </tr>
  <tr>
    <td style="padding:16px 0;text-align:center;font-size:12px;color:#999">
      <a href="mailto:{email}" style="color:#2563eb;text-decoration:none">Responder a {name}</a>
    </td>
  </tr>
</table>"""


async def send_contact_notification(name: str, email: str, reason: str, message: str) -> None:
    if not settings.contact_recipient_email:
        return

    reason_label = REASON_LABELS.get(reason, reason)
    subject = f"{reason_label} — {name}"

    text = f"Nombre: {name}\nEmail: {email}\nMotivo: {reason_label}\n\nMensaje:\n{message}"
    html = _build_html(name, email, reason, message)

    msg = MIMEMultipart("alternative")
    msg["Subject"] = subject
    msg["From"] = settings.smtp_from_email
    msg["To"] = settings.contact_recipient_email
    msg["Reply-To"] = email
    msg.attach(MIMEText(text, "plain", _charset="utf-8"))
    msg.attach(MIMEText(html, "html", _charset="utf-8"))

    def _send():
        with smtplib.SMTP(settings.smtp_host, settings.smtp_port, timeout=10) as server:
            if settings.smtp_use_tls:
                server.starttls()
            if settings.smtp_username:
                server.login(settings.smtp_username, settings.smtp_password)
            server.send_message(msg)

    await asyncio.to_thread(_send)
