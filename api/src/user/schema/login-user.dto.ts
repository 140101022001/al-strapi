import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'Nhập đúng định dạng email dùm!' })
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
