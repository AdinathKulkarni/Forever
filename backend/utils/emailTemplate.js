const escapeHtml = (value) => String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const renderEmail = ({preheader, heading, intro, content, footer}) => `
<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="color-scheme" content="light">
    <title>${escapeHtml(heading)}</title>
</head>
<body style="margin:0;padding:0;background-color:#f1f3f5;font-family:Arial,Helvetica,sans-serif;color:#161d29;">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">${escapeHtml(preheader)}</div>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#f1f3f5;">
        <tr>
            <td align="center" style="padding:36px 16px;">
                <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" style="width:100%;max-width:600px;">
                    <tr>
                        <td style="padding:22px 30px;background-color:#161d29;border-radius:12px 12px 0 0;">
                            <span style="font-size:21px;font-weight:700;letter-spacing:0.2px;color:#ffffff;">For<span style="color:#FFB5C0;">ever</span></span>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding:36px 30px;background-color:#ffffff;">
                            <h1 style="margin:0 0 14px;font-size:25px;line-height:1.3;color:#161d29;">${escapeHtml(heading)}</h1>
                            <p style="margin:0 0 24px;font-size:15px;line-height:1.7;color:#424854;">${intro}</p>
                            ${content}
                            <p style="margin:28px 0 0;font-size:14px;line-height:1.7;color:#424854;">${footer}</p>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding:20px 30px;background-color:#f8f9fb;border-radius:0 0 12px 12px;">
                            <p style="margin:0;font-size:12px;line-height:1.6;color:#6b7280;">You received this message because of activity related to your Forever account or a message sent through our website.</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`;

exports.verificationOtp = (otp) => renderEmail({
    preheader: 'Your Forever email verification code',
    heading: 'Verify your email',
    intro: 'You’re one step away from starting your shopping journey. Enter this verification code in Forever to finish creating your account:',
    content: `<div style="margin:0;padding:20px;text-align:center;background-color:#FFB5C0;border:1px solid #ffe58f;border-radius:10px;">
        <span style="font-size:32px;font-weight:700;letter-spacing:10px;color:#161d29;">${escapeHtml(otp)}</span>
    </div>
    <p style="margin:16px 0 0;font-size:13px;line-height:1.6;color:#6b7280;">This code expires in 5 minutes. For your security, don’t share it with anyone.</p>`,
    footer: 'If you didn’t request this code, you can safely ignore this email.',
});

exports.passwordResetOtp = (otp) => renderEmail({
    preheader: 'Your Forever password reset code',
    heading: 'Reset your password',
    intro: 'Use the code below to verify your email and reset your Forever account password:',
    content: `<div style="margin:0;padding:20px;text-align:center;background-color:#FFB5C0;border:1px solid #ffe1e5;border-radius:10px;">
        <span style="font-size:32px;font-weight:700;letter-spacing:10px;color:#161d29;">${escapeHtml(otp)}</span>
    </div>
    <p style="margin:16px 0 0;font-size:13px;line-height:1.6;color:#6b7280;">This code expires in 5 minutes. For your security, don’t share it with anyone.</p>`,
    footer: 'If you didn’t request a password reset, you can safely ignore this email.',
});

exports.orderConfirmation = ({
    customerName = 'there',
    orderNumber,
    orderDate,
    items = [],
    total,
    shippingAddress,
    estimatedDelivery,
} = {}) => {
    const itemsHtml = items.map(({name, quantity = 1, price}) => `
        <tr>
            <td style="padding:14px 0;border-bottom:1px solid #edf0f3;font-size:14px;line-height:1.5;color:#424854;">
                ${escapeHtml(name)} <span style="color:#6b7280;">× ${escapeHtml(quantity)}</span>
            </td>
            <td align="right" style="padding:14px 0;border-bottom:1px solid #edf0f3;font-size:14px;font-weight:600;color:#161d29;white-space:nowrap;">${escapeHtml(price)}</td>
        </tr>`).join('');
    const addressHtml = shippingAddress
        ? escapeHtml(shippingAddress).replace(/\r?\n/g, '<br>')
        : 'Your shipping address will be available in your order details.';

    return renderEmail({
        preheader: `Order ${orderNumber || 'confirmed'} is confirmed. Thank you for shopping with Forever!`,
        heading: 'Your order is confirmed!',
        intro: `Hi ${escapeHtml(customerName)}, thank you for choosing Forever. We’ve received your order and are getting it ready.`,
        content: `
            <div style="margin:0 0 24px;padding:20px 22px;background-color:#fff5f6;border:1px solid #ffe1e5;border-radius:10px;">
                <p style="margin:0 0 6px;font-size:12px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#8a4652;">Order number</p>
                <p style="margin:0;font-size:20px;font-weight:700;color:#161d29;">${escapeHtml(orderNumber || '—')}</p>
                ${orderDate ? `<p style="margin:8px 0 0;font-size:13px;color:#6b7280;">Placed ${escapeHtml(orderDate)}</p>` : ''}
            </div>
            <h2 style="margin:0 0 4px;font-size:17px;color:#161d29;">Order summary</h2>
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin:0 0 8px;">
                <tbody>${itemsHtml || '<tr><td style="padding:14px 0;color:#6b7280;">Your order items</td></tr>'}</tbody>
                ${total !== undefined ? `<tfoot><tr><td style="padding:16px 0;font-size:15px;font-weight:700;color:#161d29;">Total</td><td align="right" style="padding:16px 0;font-size:17px;font-weight:700;color:#161d29;">${escapeHtml(total)}</td></tr></tfoot>` : ''}
            </table>
            <div style="margin-top:20px;padding:18px 20px;background-color:#f8f9fb;border-radius:10px;">
                <p style="margin:0 0 8px;font-size:13px;font-weight:700;letter-spacing:.5px;text-transform:uppercase;color:#161d29;">Shipping to</p>
                <p style="margin:0;font-size:14px;line-height:1.7;color:#424854;">${addressHtml}</p>
                ${estimatedDelivery ? `<p style="margin:12px 0 0;font-size:13px;color:#424854;"><strong>Estimated delivery:</strong> ${escapeHtml(estimatedDelivery)}</p>` : ''}
            </div>`,
        footer: 'We’ll send you another update when your order is on its way. Thanks for being part of Forever!',
    });
};
