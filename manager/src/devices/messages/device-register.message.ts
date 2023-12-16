import { IsString, Length, MaxLength } from 'class-validator';

export class DeviceRegisterMessage {
  @IsString()
  @Length(5)
  code!: string;

  @IsString()
  @MaxLength(32)
  type!: string;

  @IsString()
  @MaxLength(64)
  name!: string;

  @IsString()
  @MaxLength(2)
  version!: string;
}
