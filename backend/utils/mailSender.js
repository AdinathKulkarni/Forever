const nodemailer = require('nodemailer');

const sendWithResend = async (email, title, body, options) => {
    const from = process.env.RESEND_FROM;
    if (!from) {
        throw new Error('RESEND_FROM must be configured when RESEND_API_KEY is set');
    }

    const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            from,
            to: [email],
            subject: title,
            html: body,
            ...(options.replyTo ? { reply_to: options.replyTo } : {}),
        }),
        signal: AbortSignal.timeout(15000),
    });

    const responseText = await response.text();
    let result;
    try {
        result = responseText ? JSON.parse(responseText) : {};
    } catch {
        throw new Error(`Resend returned an invalid response (HTTP ${response.status})`);
    }

    if (!response.ok) {
        throw new Error(result.message || `Resend request failed with HTTP ${response.status}`);
    }

    return result;
};

const mailSender = async (email, title, body, options = {}) => {
    if (process.env.RESEND_API_KEY) {
        return sendWithResend(email, title, body, options);
    }

    const { MAIL_HOST, MAIL_USER, MAIL_PWD } = process.env;
    if (!MAIL_HOST || !MAIL_USER || !MAIL_PWD) {
        throw new Error('Configure RESEND_API_KEY and RESEND_FROM, or MAIL_HOST, MAIL_USER, and MAIL_PWD');
    }

    const transporter = nodemailer.createTransport({
        host: MAIL_HOST,
        auth: {
            user: MAIL_USER,
            pass: MAIL_PWD,
        },
    });

    return transporter.sendMail({
        from: MAIL_USER,
        to: email,
        subject: title,
        html: body,
        ...(options.replyTo ? { replyTo: options.replyTo } : {}),
    });
}

module.exports = mailSender;