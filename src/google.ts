import superagent from 'superagent';

interface GetGoogleAuthUriInterface {
    clientId: string;
    redirectUri: string;
    scopes?: string[];
    state?: string;
    accessType?: 'online' | 'offline';
    responseType?: 'code' | 'token' | 'id_token token';
    includeGrantedScopes?: boolean;
    loginHint?: string;
    prompt?: 'none' | 'consent' | 'select_account' | 'consent select_account';
}

interface GetGoogleUserTokenInterface {
    code: string;
    clientId: string;
    clientSecret: string;
    redirectUri: string;
    grantType?: string;
}

interface GoogleUserTokenInterface {
    access_token: string;
    refresh_token?: string;
    scope: string;
    token_type: string;
    id_token?: string;
    expires_in: number;
    created_at: number;
}

interface GoogleUserInfoInterface {
    email?: string;
    family_name: string;
    gender: string;
    given_name: string;
    hd: string;
    id: string;
    link: string;
    locale: string;
    name: string;
    picture?: string;
    verified_email: boolean;
}

interface GoogleUserInfoAndTokenInterface extends GoogleUserInfoInterface {
    token: GoogleUserTokenInterface;
}

/**
 * Returns a Google OAuth2 URI
 *
 * @param clientId Client ID
 *
 * @param redirectUri Redirect URI
 *
 * @param scopes List of scopes
 *   Default ['email', 'profile', 'openid']
 *
 * @param state (Optional)
 *   A CSRF token
 *   Must be URI encoded. Tip: Use encodeURIComponent(state) when passing a state
 *   Specifies any string value that your application uses to maintain state
 *   between your authorization request and the authorization server's response.
 *   Will be added to userCreds upon authentication for you to check if
 *   it's equal to the one you provided here
 *
 * @param accessType (Optional)
 *   One of: `online` or `offline`
 *   Default: `offline`
 *   Indicates whether your application can refresh access tokens when
 *   the user is not present at the browser.
 *   Choose `offline` for a refreshable token
 *
 * @param responseType (Optional)
 *   One of: `code`, `token`, `id_token token`
 *   Default: `code`
 *
 * @param includeGrantedScopes (Optional)
 *   Default: false
 *   Enables applications to use incremental authorization
 *   to request access to additional scopes in context.
 *
 *   If you set this parameter's value to `true` and the
 *   authorization request is granted, then the new access
 *   token will also cover any scopes to which the user previously
 *   granted the application access.
 *
 * @param loginHint (Optional)
 *   Default: `null`
 *   If your application knows which user is trying to authenticate,
 *   it can use this parameter to provide a hint to the Google Authentication Server.
 *   The server uses the hint to simplify the login flow either by prefilling
 *   the email field in the sign-in form or by selecting the appropriate multi-login session.
 *   Set the parameter value to an email address or sub identifier,
 *   which is equivalent to the user's Google ID.
 *   This can help you avoid problems that occur if your app logs in the wrong user account.
 *
 * @param prompt (Optional)
 *   Default: `none`
 *   A space-delimited, case-sensitive list of prompts to present the user.
 *   If you don't specify this parameter,
 *   the user will be prompted only the first time your app requests access.
 *   Possible values are:
 *       ``none`` : Default: Do not display any authentication or consent screens.
 *                  Must not be specified with other values.
 *        ``'consent'`` : Prompt the user for consent.
 *        ``'select_account'`` : Prompt the user to select an account.
 */
export const getGoogleAuthUri = ({
    clientId,
    redirectUri,
    scopes = ['email', 'profile', 'openid'],
    state = undefined,
    accessType = 'offline',
    responseType = 'code',
    includeGrantedScopes = false,
    loginHint = undefined,
    prompt = 'none'
}: GetGoogleAuthUriInterface): string => {
    const baseUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
    const { searchParams } = baseUrl;
    searchParams.append('client_id', clientId);
    searchParams.append('redirect_uri', redirectUri);
    searchParams.append('scope', scopes.join(' '));
    if (state !== undefined) {
        searchParams.append('state', encodeURIComponent(state));
    }
    searchParams.append('access_type', encodeURIComponent(accessType));
    searchParams.append('response_type', encodeURIComponent(responseType));
    searchParams.append('include_granted_scopes', encodeURIComponent(includeGrantedScopes));
    if (loginHint !== undefined) {
        searchParams.append('login_hint', encodeURIComponent(loginHint));
    }
    searchParams.append('prompt', prompt);

    return baseUrl.toString();
};

/**
 * Returns google user token
 *
 * @param code code you get on your redirectUrl
 *
 * @param clientId clientId
 *
 * @param clientSecret clientSecret
 *
 * @param redirectUri same redirect URI as above
 *
 * @param grantType (Optional) defaults to 'authorization_code'
 *  You shouldn't need to change it unless you know what you're doing
 *
 */
export const getGoogleUserToken = async ({
    code,
    clientId,
    clientSecret,
    redirectUri,
    grantType = 'authorization_code'
}: GetGoogleUserTokenInterface): Promise<GoogleUserTokenInterface> => {
    const response = await superagent
        .post('https://oauth2.googleapis.com/token')
        .type('form')
        .send({ code })
        .send({ client_id: clientId })
        .send({ client_secret: clientSecret })
        .send({ redirect_uri: redirectUri })
        .send({ grant_type: grantType });
    response.body.created_at = Date.now();
    return response.body;
};

const _getGoogleUserInfo = async (accessToken: string): Promise<GoogleUserInfoInterface> => {
    // Check https://www.googleapis.com/discovery/v1/apis/oauth2/v2/rest for schema
    const resp = await superagent
        .get('https://www.googleapis.com/oauth2/v2/userinfo')
        .set('Authorization', `Bearer ${accessToken}`);
    return resp.body;
};

/**
 * Returns google user info + token
 *
 * @param code code you get on your redirectUrl
 *
 * @param clientId clientId
 *
 * @param clientSecret clientSecret
 *
 * @param redirectUri same redirect URI as above
 *
 * @param grantType (Optional) defaults to 'authorization_code'
 *  You shouldn't need to change it unless you know what you're doing
 *
 */
export const getGoogleUserInfo = async ({
    code,
    clientId,
    clientSecret,
    redirectUri,
    grantType = 'authorization_code'
}: GetGoogleUserTokenInterface): Promise<GoogleUserInfoAndTokenInterface> => {
    const googleUserToken = await getGoogleUserToken({
        code,
        clientId,
        clientSecret,
        redirectUri,
        grantType
    });

    const googleUserInfo = await _getGoogleUserInfo(googleUserToken.access_token);
    return {
        token: googleUserToken,
        ...googleUserInfo
    };
};
