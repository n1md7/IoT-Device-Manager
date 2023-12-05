import { ConfigService as NestConfigService } from '@nestjs/config';
import { Configuration } from '/libs/config/configuration';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ConfigService extends NestConfigService<Configuration> {}
