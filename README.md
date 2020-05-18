# Simple Social Signin

Simple social sign in for Node.js

## Usage

### Google

```javascript
import { getGoogleAuthUri, getGoogleUserInfo } from 'simple-social-signin';

const authUri = getGoogleAuthUri({
    clientId: 'a client ID',
    redirectUri: 'https://example.com/my-google-callback',
});  // Send this to the browser for the user to open


// Now your redirectUri will be called by the OAuth2 provider and will provide
// you with the `code` if the user approves
const userInfo = await getGoogleUserInfo({
    code: 'code URL query you get at /my-google-callback',
    clientId: 'a client ID',
    clientSecret: 'a client secret',
    redirectUri: 'https://example.com/my-google-callback'
});

console.log(userInfo)

{
  email: '...',
  family_name: '...',
  gender: '...',
  given_name: '...',
  hd: '...',
  id: '...',
  link: '...',
  locale: '...',
  name: '...',
  picture: '...',
  verified_email: boolean,
  token: {
      access_token: '...',
      refresh_token: '...',
      scope: '...',
      token_type: '...',
      id_token: '...',
      expires_in: '...',
      created_at: '...',
  }
}
```

### Facebook

```javascript
import { getFacebookAuthUri, getFacebookUserInfo } from 'simple-social-signin';

const authUri = getFacebookAuthUri({
    clientId: 'a client ID',
    redirectUri: 'https://example.com/my-google-callback',
    state: 'a random string'
});

const userInfo = await getFacebookUserInfo({
    code: 'code URL query you get at /my-google-callback',
    clientId: 'a client ID',
    clientSecret: 'a client secret',
    redirectUri: 'https://example.com/my-facebook-callback'
});

console.log(userInfo)

{
    email: '...',
    id: '...',
    first_name: '...',
    middle_name: '...',
    last_name: '...',
    short_name: '...',
    name: '...',
    name_format: '...',
    picture: {
        data: {
            height: 123,
            is_silhouette: boolean,
            url: '...',
            width: 321
        }
    }
}
```