'use server';

type AuthEmailHtmlOptions = {
  title: string;
  message: string;
  buttonLabel: string;
  buttonUrl: string;
};

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * Builds a self-contained HTML email using ONLY inline styles.
 *
 * Gmail/Outlook strip `<style>` blocks inside `<head>`, so a template whose
 * formatting lives in a `<style>` tag renders as unformatted text (looks like
 * plain text even though it is sent as `text/html`). Keep every rule on the
 * element's `style` attribute instead.
 */
async function buildAuthEmailHtml({
  title,
  message,
  buttonLabel,
  buttonUrl,
}: AuthEmailHtmlOptions): Promise<string> {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${escapeHtml(title)}</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f4f4;font-family:Arial,Helvetica,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f4;padding:20px 0;">
    <tr>
      <td align="center">
        <table role="presentation" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:#ffffff;border-radius:8px;box-shadow:0 2px 4px rgba(0,0,0,0.1);">
          <tr>
            <td align="center" style="padding:24px 24px 0;font-size:24px;font-weight:bold;color:#333333;">
              ${escapeHtml(title)}
            </td>
          </tr>
          <tr>
            <td style="padding:20px 24px;font-size:16px;line-height:1.6;color:#555555;">
              ${message}
            </td>
          </tr>
          <tr>
            <td align="center" style="padding:0 24px 8px;">
              <a href="${escapeHtml(buttonUrl)}" style="display:inline-block;background-color:#007BFF;color:#ffffff;padding:12px 24px;text-decoration:none;border-radius:5px;font-size:16px;">
                ${escapeHtml(buttonLabel)}
              </a>
            </td>
          </tr>
          <tr>
            <td style="padding:16px 24px 24px;font-size:13px;line-height:1.5;color:#555555;">
              <p style="margin:0 0 8px;">If the button above doesn't work, copy and paste the following link into your browser:</p>
              <p style="margin:0;"><a href="${escapeHtml(buttonUrl)}" style="color:#007BFF;word-break:break-all;">${escapeHtml(buttonUrl)}</a></p>
            </td>
          </tr>
        </table>
        <p style="margin:16px 0 0;font-size:12px;color:#999999;">If you did not request this email, you can safely ignore it.</p>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export async function resetPasswordEmailHtml(url: string): Promise<string> {
  return buildAuthEmailHtml({
    title: 'Reset Your Password',
    message:
      '<p style="margin:0 0 12px;">Hello,</p>' +
      '<p style="margin:0;">You recently requested to reset your password. Click the button below to proceed:</p>',
    buttonLabel: 'Reset Password',
    buttonUrl: url,
  });
}

export async function emailVerificationEmailHtml(url: string): Promise<string> {
  return buildAuthEmailHtml({
    title: 'Verify Your Email',
    message:
      '<p style="margin:0 0 12px;">Hello,</p>' +
      '<p style="margin:0;">Thanks for signing up. Please verify your email address by clicking the button below:</p>',
    buttonLabel: 'Verify Email',
    buttonUrl: url,
  });
}
