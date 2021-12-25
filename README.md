<p>
<a href="https://github.com/omarryhan/simple-social-signin/actions?query=workflow%3ACI"><img alt="Build Status" src="https://github.com/omarryhan/simple-social-signin/workflows/CI/badge.svg"></a>
</p>

# Simple Social Signin

Simple social sign in for Node.js

## Setup

```bash
npm install simple-social-signin
```

or 

```bash
yarn add simple-social-signin
```

## Usage

### Google

1. Import 
```javascript
import { getGoogleAuthUri, getGoogleUserInfo } from 'simple-social-signin';
```

2. Get auth URI
```javascript
const authUri = getGoogleAuthUri({
    clientId: 'a client ID',
    redirectUri: 'https://example.com/my-google-callback',
});  // Send this to the browser for the user to open
```

3. Get user info
```javascript
console.log(await getGoogleUserInfo({
    code: 'code URL query you get at /my-google-callback',
    clientId: 'a client ID',
    clientSecret: 'a client secret',
    redirectUri: 'https://example.com/my-google-callback'
}));
```

```
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

1. Import 
```javascript
import { getFacebookAuthUri, getFacebookUserInfo } from 'simple-social-signin';
```

2. Get auth URI
```javascript
const authUri = getFacebookAuthUri({
    clientId: 'a client ID',
    redirectUri: 'https://example.com/my-facebook-callback',
    state: 'a random string'
});
```

3. Get user info
```javascript
console.log(await getFacebookUserInfo({
    code: 'code URL query you get at /my-facebook-callback',
    clientId: 'a client ID',
    clientSecret: 'a client secret',
    redirectUri: 'https://example.com/my-facebook-callback'
}));
```

```
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

### Dependencies

- Superagent HTTP lib

### Development

Easiest way is to use yarn to install this package locally

In your app:
```sh
yarn add file:./../../simple-social-signin
```
