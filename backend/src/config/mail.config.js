// Importing modules
import nodemailer from "nodemailer";
import { SMTP_PASS, SMTP_PORT, SMTP_SERVICE, SMTP_USER } from "./env.config";

// Making a transporter to send the mails
const transporter = nodemailer.createTransport({
    host: SMTP_SERVICE,
    port: SMTP_PORT,
    auth: {
        user: SMTP_USER,
        pass: SMTP_PASS
    }
});

export default transporter
