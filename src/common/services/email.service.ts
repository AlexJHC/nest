import { Injectable, Logger } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { configAWS } from './constants';

interface EmailParams {
  message: string;
  recipient: string;
  subject: string;
}

@Injectable()
export class EmailsService {
  private readonly SES = new AWS.SES(configAWS);
  private readonly logger = new Logger(EmailsService.name);

  sendEmail({ message, subject, recipient }: EmailParams) {
    const params: AWS.SES.SendEmailRequest = {
      Source: configAWS.email,
      Destination: {
        ToAddresses: Array.isArray(recipient) ? recipient : [recipient],
      },
      Message: {
        Body: {
          Html: {
            Data: message,
          },
        },
        Subject: {
          Data: subject,
        },
      },
    };

    try {
      return this.SES.sendEmail(params).promise();
    } catch (e) {
      this.logger.error(e.message || e);
    }
  }
}
