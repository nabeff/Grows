import type { CollectionAfterChangeHook } from 'payload'

type SubField = { field: string; value: unknown }

const FIELD_LABELS: Record<string, string> = {
  email: 'Email',
  fullName: 'Full name',
  phone: 'Phone',
  profession: 'Profession & specialty',
  sector: 'Sector',
  objective: 'Main objective',
  leadershipLevel: 'Leadership level (1–10)',
  preferredContact: 'Preferred contact',
  sponsor: 'Sponsor',
  rgpdConsent: 'GDPR consent',
}

const HIDDEN_FIELDS = new Set([
  'eventTitle',
  'eventSlug',
  'eventDate',
  'eventLocation',
])

const escape = (v: unknown): string => {
  const s = v === null || v === undefined ? '' : String(v)
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

const formatValue = (field: string, value: unknown): string => {
  if (field === 'rgpdConsent') return value ? 'Yes' : 'No'
  if (value === null || value === undefined || value === '') return '—'
  return escape(value)
}

export const sendBrandedRegistrationEmail: CollectionAfterChangeHook = async ({
  doc,
  operation,
  req: { payload, context },
}) => {
  if (operation !== 'create') return doc
  if (context.skipBrandedEmail) return doc

  const submissionData: SubField[] = Array.isArray(doc?.submissionData) ? doc.submissionData : []
  const byField = Object.fromEntries(submissionData.map((f) => [f.field, f.value])) as Record<
    string,
    unknown
  >

  const eventTitle = (byField.eventTitle as string) || 'Unknown event'
  const eventDate = (byField.eventDate as string) || ''
  const eventLocation = (byField.eventLocation as string) || ''
  const eventSlug = (byField.eventSlug as string) || ''

  const rows = submissionData
    .filter((f) => !HIDDEN_FIELDS.has(f.field))
    .map(
      (f) =>
        `<tr>
           <td style="padding:10px 14px;border-bottom:1px solid #eef1ee;color:#6b7280;font-size:13px;width:180px;">${escape(FIELD_LABELS[f.field] || f.field)}</td>
           <td style="padding:10px 14px;border-bottom:1px solid #eef1ee;color:#111827;font-size:14px;">${formatValue(f.field, f.value)}</td>
         </tr>`,
    )
    .join('')

  const eventUrl = eventSlug ? `https://www.grows.ma/events/${eventSlug}` : 'https://www.grows.ma'

  const html = `
<!doctype html>
<html>
  <body style="margin:0;padding:0;background:#f3f5f4;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f3f5f4;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.06);">
            <tr>
              <td style="padding:24px 28px;background:#111111;">
                <div style="display:inline-block;font-weight:800;letter-spacing:1px;color:#ffffff;font-size:22px;">GROWS <span style="color:#18CB96;">↗</span></div>
                <div style="color:#9ca3af;font-size:11px;letter-spacing:2px;margin-top:4px;">LINKING CARE WITH TRUST</div>
              </td>
            </tr>
            <tr>
              <td style="padding:28px 28px 8px 28px;">
                <div style="color:#18CB96;font-size:12px;font-weight:600;letter-spacing:1px;">NEW EVENT REGISTRATION</div>
                <h1 style="margin:8px 0 4px 0;color:#111827;font-size:22px;font-weight:700;line-height:1.3;">${escape(eventTitle)}</h1>
                <div style="color:#6b7280;font-size:13px;">${escape(eventDate)}${eventLocation ? ` &middot; ${escape(eventLocation)}` : ''}</div>
              </td>
            </tr>
            <tr>
              <td style="padding:16px 28px 8px 28px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #eef1ee;border-radius:12px;overflow:hidden;">
                  ${rows}
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:20px 28px 28px 28px;">
                <a href="${eventUrl}" style="display:inline-block;background:#18CB96;color:#ffffff;text-decoration:none;font-weight:600;font-size:14px;padding:10px 18px;border-radius:999px;">View event page</a>
              </td>
            </tr>
            <tr>
              <td style="padding:18px 28px;background:#fafafa;color:#6b7280;font-size:12px;text-align:center;">
                Sent automatically by grows.ma — Linking Care with Trust
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`

  const to = process.env.REGISTRATION_TO || 'contact@grows.ma'
  const from = process.env.SMTP_USER
  if (!from) {
    payload.logger.warn('SMTP_USER missing — skipping branded registration email')
    return doc
  }

  try {
    await payload.sendEmail({
      to,
      from: { address: from, name: process.env.SMTP_FROM_NAME || 'Grows' },
      replyTo: (byField.email as string) || undefined,
      subject: `New registration – ${eventTitle}`,
      html,
    })
    payload.logger.info(`Sent branded registration email for "${eventTitle}" to ${to}`)
  } catch (err) {
    payload.logger.error({ err }, 'Failed to send branded registration email')
  }

  return doc
}
