import { Injectable } from '@angular/core';

@Injectable()
export class Config {
    public facebook = {
        apiUrl: 'https://graph.facebook.com/v2.3/',
        appId: '842451739256645',
        scope: ['email']
    };
    public google = {
        apiUrl: 'https://www.googleapis.com/oauth2/v3/',
        appId: '400671186930-m07eu77bm43tgr30p90k6b9e1qgsva4p.apps.googleusercontent.com',
        scope: ['email']
    };
}