import notificationsConfig from 'common/src/config/notifications';
import nodemailer from 'nodemailer';
import config from '../../config/config';
import logger from '../../config/logger';

const configMapSettings = notificationsConfig();
const emailSettings = configMapSettings.email;

const emailNotificationAdapter = {
  send: async (notification) => {
    const { dev } = configMapSettings;
    const accountSettings = dev ? await nodemailer.createTestAccount() : { user: config.emailUsername, pass: config.emailPassword };

    const transporter = nodemailer.createTransport({
      host: emailSettings.host,
      port: emailSettings.port,
      secure: emailSettings.secure,
      auth: {
        user: accountSettings.user,
        pass: accountSettings.pass,
      },
    });

    // Don't cc the person who has requested the project initially
    // Awaiting review for cookie/fair usage agreement
    // const receivers = dev ? 'someone@example.com' : notification.userEmails;

    const info = await transporter.sendMail({
      from: `"${emailSettings.fromDisplayName}" <${emailSettings.fromAddress}>`,
      to: emailSettings.toAddresses,
      subject: notification.title,
      text: notification.message,
    });

    logger.info('Message sent: %s', info.messageId);
    if (dev) {
      logger.info('Running in DEV mode. Preview URL: %s', nodemailer.getTestMessageUrl(info));
      logger.info(`Email recipients hidden due to DEV mode, notification would've been cc'd to ${notification.userEmails}`);
    }
  },
};

export default emailNotificationAdapter;
