import { Injectable } from '@nestjs/common';


@Injectable()
export class AuthConfig {
    public UserPoolId: string
    public ClientId: string
    public secretKey: string
    constructor(){
        this.UserPoolId = 'us-east-1_6hrF40OJv';
        this.ClientId = '5gtgictphm4nm9c786j18m4ktb';
        this.secretKey = "19jp3l5tn5iun7cevpdoc08p63hc50mpeq98at6ggor4f7047sfe";
    }
};