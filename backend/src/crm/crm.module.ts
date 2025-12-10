import { Module } from '@nestjs/common';
import { ContactsModule } from './contacts/contacts.module';
import { LeadsModule } from './leads/leads.module';
import { ActivitiesModule } from './activities/activities.module';

@Module({
    imports: [ContactsModule, LeadsModule, ActivitiesModule],
    exports: [ContactsModule, LeadsModule, ActivitiesModule],
})
export class CrmModule { }
