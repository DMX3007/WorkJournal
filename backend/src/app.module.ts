import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WorkTypesModule } from './work-types/work-types.module';
import { JournalEntriesModule } from './journal-entries/journal-entries.module';
import { WorkTypesController } from './work-types/work-types.controller';

@Module({
  imports: [WorkTypesModule, JournalEntriesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
