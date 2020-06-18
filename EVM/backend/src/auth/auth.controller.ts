import { BadRequestException, Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthCredentialsDto, AuthRegisterDto } from './auth.interface';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';

import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserAttribute,
  CognitoUserPool,
  CognitoUserSession,
  CognitoIdToken,
  CognitoAccessToken,
  CognitoRefreshToken,
  ICognitoUserPoolData,
} from 'amazon-cognito-identity-js';

import { CognitoSessionDto } from './auth.interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() AuthRegisterDto: AuthRegisterDto) {
    if (
      AuthRegisterDto.password.length < 8 ||
      !/[a-z]/.test(AuthRegisterDto.password) ||
      !/[A-Z]/.test(AuthRegisterDto.password) ||
      !/[0-9]/.test(AuthRegisterDto.password)
    ) {
      throw new BadRequestException('Password requirements not met.');
    }
    try {
      return await this.authService.register(AuthRegisterDto);
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }
  @Post('authenticate')
  async authenticate(@Body() authenticateRequest: AuthCredentialsDto) {
    try {
      return await this.authService.authenticateUser(authenticateRequest);
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Post("session-refresh")
  async refresh(@Body() session: CognitoSessionDto, @Req() request, @Res() response){
    const AccessToken = new CognitoAccessToken({AccessToken: session.accessToken});
    const IdToken = new CognitoIdToken({IdToken: session.idToken});
    const RefreshToken = new CognitoRefreshToken({RefreshToken: session.refreshToken});
    const sessionData = {
      IdToken: IdToken,
      AccessToken: AccessToken,
      RefreshToken: RefreshToken
    };

    const cachedSession = new CognitoUserSession(sessionData);
    if (cachedSession.isValid()) {
      console.log("Username: " + request.user.email);
       const cognitoUser = this.authService.getCognitoUser(request.user.email);
       const authService = this.authService;

       (await cognitoUser).refreshSession(RefreshToken, async function(err, session){
          if (err) throw err;
          

          const tokens = await authService.getTokens(session);

          console.log("Tokens");
          console.log(tokens);

          console.log("Session");
          console.log(session);

          response.status(200).send(tokens);
       })
    } else {
      response.status(401).json({ message: "Invalid session"});
    }
  }
}