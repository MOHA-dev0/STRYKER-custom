/**
 * قالب البريد الذي يصل إلى فريق STRYKER من نماذج الموقع.
 *
 * عملاء البريد لا يعرفون Tailwind ولا الأنماط الخارجية، فالتنسيق كله inline
 * وداخل جدول — هذا أثقل مما نكتبه في الصفحات، لكنه الشكل الوحيد الذي يصمد
 * في Gmail وOutlook معاً. الألوان مأخوذة من لوحة الموقع (رمل/حبر).
 */

export type EmailField = { label: string; value: string }

const ESCAPES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
}

/** نص المستخدم يدخل قالب HTML، فلا يمرّ حرف نشط كما هو. */
export function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (char) => ESCAPES[char])
}

export function renderTeamEmail({
  fields,
  brand,
  rtl,
}: {
  fields: EmailField[]
  brand: { short: string; name: string }
  rtl: boolean
}): string {
  const rows = fields
    .map(
      ({ label, value }) => `
          <tr>
            <td style="padding:10px 0;border-bottom:1px solid #e7e1d6;font:600 11px/1.6 system-ui,sans-serif;letter-spacing:.1em;text-transform:uppercase;color:#8a8175;white-space:nowrap;vertical-align:top;">${escapeHtml(label)}</td>
            <td style="padding:10px 16px;border-bottom:1px solid #e7e1d6;font:400 15px/1.8 system-ui,sans-serif;color:#1c1a17;white-space:pre-wrap;">${escapeHtml(value)}</td>
          </tr>`
    )
    .join("")

  return `<!doctype html>
<html dir="${rtl ? "rtl" : "ltr"}">
  <body style="margin:0;padding:24px;background:#f6f2ea;">
    <table role="presentation" width="100%" style="max-width:560px;margin:0 auto;border-collapse:collapse;background:#fffdf8;border:1px solid #e7e1d6;">
      <tr>
        <td style="padding:22px 28px;border-bottom:2px solid #1c1a17;">
          <div style="font:800 13px/1 system-ui,sans-serif;letter-spacing:.24em;color:#1c1a17;">${escapeHtml(brand.short)}</div>
          <div style="margin-top:7px;font:400 12px/1 system-ui,sans-serif;color:#8a8175;">${escapeHtml(brand.name)}</div>
        </td>
      </tr>
      <tr>
        <td style="padding:6px 28px 26px;">
          <table role="presentation" width="100%" style="border-collapse:collapse;">${rows}
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`
}
