import { IsString, IsEnum, IsNumber, IsArray, IsBoolean, IsObject } from 'class-validator'

export interface AuthRegisterDto {
    name: string;
    email: string;
    password: string;
  }
  
export interface AuthCredentialsDto {
  name: string;
  password: string;
}

export class CognitoSessionDto{
  @IsString()
  idToken: string;

  @IsString()
  accessToken: string;

  @IsString()
  refreshToken: string;
}