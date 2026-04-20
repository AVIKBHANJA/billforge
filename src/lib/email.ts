import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendInvoiceEmail({
  to,
  invoiceNumber,
  amount,
  currency,
  dueDate,
  paymentLink,
  fromName,
}: {
  to: string;
  invoiceNumber: string;
  amount: number;
  currency: string;
  dueDate: string;
  paymentLink?: string;
  fromName: string;
}) {
  const { data, error } = await resend.emails.send({
    from: `${fromName} via BillForge <invoices@billforge.app>`,
    to,
    subject: `Invoice ${invoiceNumber} - ${currency} ${amount.toFixed(2)}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Invoice ${invoiceNumber}</h2>
        <p>You have received an invoice from <strong>${fromName}</strong>.</p>
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Amount</strong></td>
            <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">${currency} ${amount.toFixed(2)}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Due Date</strong></td>
            <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">${dueDate}</td>
          </tr>
        </table>
        ${
          paymentLink
            ? `<a href="${paymentLink}" style="display: inline-block; padding: 12px 24px; background: #059669; color: white; text-decoration: none; border-radius: 6px;">Pay Now</a>`
            : ""
        }
        <p style="color: #666; margin-top: 20px; font-size: 14px;">Sent via BillForge</p>
      </div>
    `,
  });

  if (error) throw error;
  return data;
}
