const nodemailer = require('nodemailer');


const sendWithBrevo = async (email, title, body, options = {}) => {
    const senderEmail = process.env.SENDER_EMAIL;
    const senderName = process.env.SENDER_NAME;

    if (!senderEmail || !senderName) {
        throw new Error(
            'SENDER_EMAIL and SENDER_NAME must be configured when BREVO_API_KEY is set'
        );
    }

    const response = await fetch(
        'https://api.brevo.com/v3/smtp/email',
        {
            method: 'POST',
            headers: {
                accept: 'application/json',
                'api-key': process.env.BREVO_API_KEY,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                sender: {
                    name: senderName,
                    email: senderEmail,
                },
                to: [{ email }],
                subject: title,
                htmlContent: body,
                ...(options.replyTo
                    ? { replyTo: { email: options.replyTo } }
                    : {}),
            }),
            signal: AbortSignal.timeout(15000),
        }
    );

    const responseText = await response.text();

    let result;
    try {
        result = responseText ? JSON.parse(responseText) : {};
    } catch {
        throw new Error(
            `Brevo returned an invalid response (HTTP ${response.status})`
        );
    }

    if (!response.ok) {
        console.error('Brevo Error Details:', response.status, responseText);
        throw new Error(
            result.message ||
            `Brevo request failed with HTTP ${response.status}: ${responseText}`
        );
    }

    return result;
};


const mailSender = async (email, title, body, options = {}) => {
    if (process.env.BREVO_API_KEY) {
        return sendWithBrevo(email, title, body, options);
    }

    const { MAIL_HOST, MAIL_USER, MAIL_PWD } = process.env;
    if (!MAIL_HOST || !MAIL_USER || !MAIL_PWD) {
        throw new Error('Configure BREVO_API_KEY, SENDER_EMAIL, and SENDER_NAME, or MAIL_HOST, MAIL_USER, and MAIL_PWD');
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
};

module.exports = mailSender;
