import { Resend } from 'resend';

interface NotificationItem {
  topic: string;
  reasoning: string;
}

function getKW(dateStr: string): number {
  const date = new Date(dateStr);
  const startOfYear = new Date(date.getFullYear(), 0, 1);
  const days = Math.floor((date.getTime() - startOfYear.getTime()) / 86_400_000);
  return Math.ceil((days + startOfYear.getDay() + 1) / 7);
}

export async function sendProposalNotification({
  proposalId,
  weekDate,
  items,
}: {
  proposalId: string;
  weekDate: string;
  items: NotificationItem[];
}) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const kw = getKW(weekDate);
  const baseUrl = process.env.NEXTAUTH_URL ?? 'https://gpdb.norinit.de';

  const topicsList = items
    .map(item => `<li><strong>${item.topic}</strong><br>${item.reasoning}</li>`)
    .join('\n');

  await resend.emails.send({
    from: 'GPDB Agent <agent@norinit.de>',
    to: process.env.NOTIFICATION_EMAIL!,
    subject: `GPDB KW ${kw}: ${items.length} neue Themen zur Review`,
    html: `
      <h2>GPDB Update-Agent — KW ${kw}</h2>
      <p>Der Agent hat <strong>${items.length} Themen</strong> zur Review vorbereitet:</p>
      <ul style="line-height:1.8">${topicsList}</ul>
      <p style="margin-top:24px">
        <a href="${baseUrl}/admin/proposals" style="background:#1a1a1a;color:#fff;padding:10px 20px;border-radius:6px;text-decoration:none">
          → Zur Review-Seite
        </a>
      </p>
    `,
  });
}
