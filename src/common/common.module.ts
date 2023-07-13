import { Global, Module } from '@nestjs/common';
import { EmailsService } from './services/email.service';

@Global()
@Module({
  providers: [EmailsService],
  exports: [EmailsService],
})
export class CommonModule {}
