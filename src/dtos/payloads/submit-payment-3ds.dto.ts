import { IsNotEmpty, IsString } from 'class-validator';

export class SubmitPayment3dsDto {
  @IsString()
  @IsNotEmpty()
  cnp3dsLink: string;
  @IsString()
  @IsNotEmpty()
  token: string;

  @IsString()
  @IsNotEmpty()
  PaRes: string;

  @IsString()
  @IsNotEmpty()
  MD: string;
}

export class SubmitPayment3dsQueryParamsDto {
  @IsString()
  @IsNotEmpty()
  cnp3dsLink: string;
  @IsString()
  @IsNotEmpty()
  token: string;
}
export class SubmitPayment3dsBodyDto {
  @IsString()
  @IsNotEmpty()
  PaRes: string;

  @IsString()
  @IsNotEmpty()
  MD: string;
}
