
import * as nodemailer from 'nodemailer';

export interface SendEmailOptions {
    to: string;
    subject: string;
    text: string;
    attachments?: Attachment[];
}
export interface Attachment{
    filename: string,
    path: string,
}


export interface EmailServicePort {
    sendEmail(sendEmailOptions: SendEmailOptions): Promise<boolean>;
}
export class EmailService implements EmailServicePort {

private transporter : nodemailer.Transporter


constructor(
    mailerEmail:string ,
    senderEmailPass:string
) {
    this.transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: mailerEmail, 
            pass: senderEmailPass
        }
    });
}

async sendEmail(sendEmailOptions: SendEmailOptions): Promise<boolean> {
    const { to, subject, text, attachments } = sendEmailOptions;
    try {
    const result = await this.transporter.sendMail({
        
        to,
        subject,
        html: text,
        attachments

    });
    console.log(result);
    return true;
    } catch (error) {
        return false;
    }
}

}