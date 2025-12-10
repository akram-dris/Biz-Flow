import { PartialType } from '@nestjs/swagger'; // Or mapped-types if swagger not used, but plan mentioned Swagger
import { CreateContactDto } from './create-contact.dto';

export class UpdateContactDto extends PartialType(CreateContactDto) { }
