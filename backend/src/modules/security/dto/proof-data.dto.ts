import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsEnum, IsOptional, IsObject } from 'class-validator';

export enum ProofType {
  IDENTITY = 'identity',
  AGE = 'age',
  CREDENTIAL = 'credential',
  MEMBERSHIP = 'membership',
  OWNERSHIP = 'ownership',
}

export class ProofDataDto {
  @ApiProperty({
    description: '待验证的数据',
    example: {
      did: 'did:atom:12345',
      claims: {
        name: '张三',
        age: 25,
        idNumber: '110101199001011234',
      },
    },
  })
  @IsNotEmpty({ message: '数据不能为空' })
  data: Record<string, any>;

  @ApiProperty({
    description: '证明类型',
    enum: ProofType,
    example: ProofType.IDENTITY,
  })
  @IsNotEmpty({ message: '证明类型不能为空' })
  @IsEnum(ProofType, { message: '无效的证明类型' })
  proofType: ProofType;

  @ApiProperty({
    description: '证明参数',
    required: false,
    example: { useCircomCircuit: true, circuitId: 'identity-v1' },
  })
  @IsOptional()
  @IsObject({ message: '证明参数必须是对象' })
  params?: Record<string, any>;
}
