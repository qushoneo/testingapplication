import MailController from '../controllers/MailController';
import nodemailer, { Transporter } from 'nodemailer';

const transporter: Transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587, // !!! меняем порт
  secure: false, // !!! без SSL на старте, потом TLS
  auth: {
    user: process.env.SMTP_USER!,
    pass: process.env.SMTP_PASS!,
  },
});

const mailController = new MailController(transporter);

export default mailController;
