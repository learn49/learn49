import { Injectable } from '@nestjs/common';
import { SendGridService } from '@anchan828/nest-sendgrid';

import sendGridConfig from '../config/sendgrid';

interface ISendGridService {
  welcomeUser(params: object): void;
}

@Injectable()
export class SendgridService implements ISendGridService {
  constructor(private readonly sendGrid: SendGridService) {}

  async userEnrollment({ name, course, email, activatedCode }) {
    const templateData = {
      name,
      course,
      email,
      activatelink: `${sendGridConfig.URLServer}/create-password/${activatedCode}`
    };
    const sendGridModel = {
      to: email,
      from: sendGridConfig.from,
      dynamicTemplateData: templateData,
      templateId: sendGridConfig.Template_Id_MANUAL_ENROLLMENT
    };
    await this.sendGrid.send(sendGridModel);
  }

  async welcomeUser({ email, passwd, activatedCode }) {
    const templateData = {
      name: 'Usuário',
      email,
      passwd,
      activatelink: `${sendGridConfig.URLServer}/confirmation/${activatedCode}`
    };
    const sendGridModel = {
      to: email,
      from: sendGridConfig.from,
      dynamicTemplateData: templateData,
      templateId: sendGridConfig.Template_Id_WELCOME
    };
    await this.sendGrid.send(sendGridModel);
  }

  async forgotPasswd({ email, activatedCode }) {
    const templateData = {
      email,
      activatelink: `${sendGridConfig.URLServer}/reset-password/${activatedCode}`
    };
    const sendGridModel = {
      to: email,
      from: sendGridConfig.from,
      dynamicTemplateData: templateData,
      templateId: sendGridConfig.Template_Id_FORGOT
    };
    await this.sendGrid.send(sendGridModel);
  }

  async activateUser({ email, activatedCode }) {
    const templateData = {
      email,
      activatelink: `${sendGridConfig.URLServer}/verify/${activatedCode}`
    };
    const sendGridModel = {
      to: email,
      from: sendGridConfig.from,
      dynamicTemplateData: templateData,
      templateId: sendGridConfig.Template_Id_ACTIVATE
    };
    await this.sendGrid.send(sendGridModel);
  }

  async newTicket({ name, title, threadId }) {
    const templateData = {
      name,
      title,
      activatelink: `${sendGridConfig.URLServer}/app/support/tickets/${threadId}`
    };
    const sendGridModel = {
      to: sendGridConfig.from,
      from: sendGridConfig.from,
      dynamicTemplateData: templateData,
      templateId: sendGridConfig.Template_Id_NEW_TICKET
    };
    await this.sendGrid.send(sendGridModel);
  }
}
