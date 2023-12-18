import { ApiProperty } from '@nestjs/swagger';

export class HttpErrorSchema {
  @ApiProperty({
    example: '500',
    type: Number,
    description: 'Error code',
  })
  statusCode!: number;

  @ApiProperty({
    example: 'Internal Server Error',
    type: String,
    description: 'Error message',
  })
  message!: string;

  @ApiProperty({
    example: '2021-09-19T12:00:00.000Z',
    type: String,
    description: 'Timestamp',
  })
  timestamp!: string;

  @ApiProperty({
    example: 'api/v1/systems',
    type: String,
    description: 'Path',
  })
  path!: string;

  @ApiProperty({
    example: 'Error details',
    type: String,
    description: 'Error details',
  })
  details?: string;
}
