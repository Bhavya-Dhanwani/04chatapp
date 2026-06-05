// Importing modules 
import { TRANSACTION_MAIL } from "../config/env.config.js";
import transporter from "../config/mail.config.js";

// funciton to send the mails
async function sendMail(to, subject, body) {

    // adding options
    let options = {
        from: `Chat <${TRANSACTION_MAIL}>`,
        to,
        subject,
        html: body,
    };

    // sending mail from transporter 
    await transporter.sendMail(options);
}

export default sendMail;
