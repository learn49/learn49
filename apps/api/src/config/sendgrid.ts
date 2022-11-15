export default {
  apiKey: process.env.SENDGRID_API_KEY,
  from: process.env.SENDGRID_FROM,
  URLServer: process.env.SENDGRID_URL_ACTIVATION || 'http://localhost:3001',
  Contact_Email: process.env.SENDGRID_CONTACT_EMAIL,
  Template_Id_WELCOME: process.env.SENDGRID_TEMPLATE_ID_WELCOME,
  Template_Id_FORGOT: process.env.SENDGRID_TEMPLATE_ID_FORGOT,
  Template_Id_ACTIVATE: process.env.SENDGRID_TEMPLATE_ID_ACTIVATE,
  Template_Id_MANUAL_ENROLLMENT: process.env.SENDGRID_TEMPLATE_ID_MANUAL_ENROLLMENT,
  Template_Id_NEW_TICKET: process.env.SENDGRID_TEMPLATE_ID_NEW_TICKET
};
