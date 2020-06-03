import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ClaimVerifyResult, handler } from './jwt.verify';
import { AuthService } from './auth.service';
import { passportJwtSecret } from 'jwks-rsa';
import { access } from 'fs';


const cognitoPoolId = 'us-east-1_6hrF40OJv';
const cognitoIssuer = `https://cognito-idp.us-east-1.amazonaws.com/${cognitoPoolId}`;

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `${cognitoIssuer}/.well-known/jwks.json`,
      })

    });
  }

  async validate(payload: any) {
    //console.log(accessToken;
    //console.log(refreshToken);
    //console.log(payload);
    console.log('Payload');
    console.log(payload);

    return { id: payload.sub, username: payload['cognito:username'], email: payload.email };
  }
}