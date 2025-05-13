import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class BindIdentityDto {
  @ApiProperty({ description: 'DID标识符', example: 'did:ethr:0x1234...' })
  @IsString()
  @IsNotEmpty()
  did: string;

  @ApiProperty({ description: '身份别名', example: '工作身份' })
  @IsString()
  @IsNotEmpty()
  alias: string;
}
