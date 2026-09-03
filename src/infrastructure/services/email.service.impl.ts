import nodemailer from 'nodemailer';
import { EmailService, SendMailOptions } from '../../domain/services/email.service';

export class EmailServiceImpl extends EmailService {

  private transporter: nodemailer.Transporter;

  constructor(
    mailerService: string,
    mailerEmail: string,
    senderEmailPassword: string,
  ) {
    super();
    this.transporter = nodemailer.createTransport({
      service: mailerService,
      auth: {
        user: mailerEmail,
        pass: senderEmailPassword,
      },
    });
  }

  async sendEmail(options: SendMailOptions): Promise<boolean> {
    const { to, subject, htmlBody, attachments = [] } = options;

    try {
      await this.transporter.sendMail({
        to,
        subject,
        html: htmlBody,
        attachments,
      });
      return true;
    } catch {
      return false;
    }
  }
}
