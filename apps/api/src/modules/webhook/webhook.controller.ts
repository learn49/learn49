import { Controller, Post, Body, Param } from '@nestjs/common';
import { MessageDto } from './dto/webhook';
import { WebhookService } from './webhook.service';
import { UseInterceptors } from '@nestjs/common';
import { SentryInterceptor } from '../../sentry.interceptor';
import { WebhookTesteService } from './webhookTeste.service';

@UseInterceptors(SentryInterceptor)
@Controller('extensions')
export class WebhookController {
  constructor(
    private readonly webhook: WebhookService,
    private readonly webhookTeste: WebhookTesteService,
  ) {}

  @Post(':idInstallation/webhook')
  hotmartWebHook(
    @Param('idInstallation') idInstallation: string,
    @Body() input: MessageDto,
  ) {
    return this.webhook.create({ idInstallation, webhookData: input });
  }

  @Post(':idInstallation/webhookTeste')
  hotmartTesteWebHook(
    @Param('idInstallation') idInstallation: string,
    @Body() input: MessageDto,
  ) {
    return this.webhookTeste.create({ idInstallation, webhookData: input });
  }
}
