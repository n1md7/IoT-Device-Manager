import { IsEnum, IsOptional, IsString, Length, MaxLength } from 'class-validator';
import { DeviceType } from '/src/devices/enums/type.enum';

export class DeviceRegisterMessage {
  @IsString()
  @Length(5)
  code!: string;

  @IsEnum(DeviceType)
  type!: DeviceType;

  @IsString()
  @MaxLength(64)
  name!: string;

  @IsString()
  @MaxLength(2)
  version!: string;

  @IsString()
  @IsOptional()
  @MaxLength(256)
  description?: string;

  @IsString()
  @IsOptional()
  @MaxLength(15)
  ipAddress?: string;
}
