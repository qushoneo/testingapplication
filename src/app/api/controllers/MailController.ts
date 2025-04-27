import { SentMessageInfo, Transporter } from 'nodemailer';
import { MailOptions } from 'nodemailer/lib/json-transport';

class MailController {
  private transporter: Transporter;

  constructor(transporter: Transporter) {
    this.transporter = transporter;
  }

  async sendMail(options: MailOptions): Promise<SentMessageInfo> {
    return await this.transporter.sendMail({
      from: process.env.SMTP_USER,
      ...options,
    });
  }
}

export default MailController;
