import superagent from 'superagent';

const API_VERSION = '7.0';
const DEFAULT_SCOPE = [
    'email',
    'public_profile'
];

const DEFAULT_ME_FIELDS = [
    'email',
    'id',
    'first_name',
    'middle_name',
    'last_name',
    'name',
    'name_format',
    'short_name',
    'picture'
];

interface GetFacebookAuthUriInterface {
    clientId: string;
    redirectUri: string;
    state: string;
    scopes?: string[];
    responseType?: 'code' | 'token' | 'code token' | 'id_token token';
}

interface GetFacebookUserTokenInterface {
    code: string;
    clientId: string;
    clientSecret: string;
    redirectUri: string;
}


interface GetFacebookUserInfoInterface extends GetFacebookUserTokenInterface {
    meFields?: string[];
}

interface FacebookUserTokenInterface {
    access_token: string;
    refresh_token?: string;
    token_type: 'bearer';
    expires_in: number;
    created_at: number;
}

interface FacebookUserInfoInterface {
    email?: string;
    id: string;
    first_name: string;
    middle_name: string;
    last_name: string;
    short_name: string;
    name: string;
    name_format: string;
    picture?: {
        data: {
            height: number;
            is_silhouette: boolean;
            url: string;
            width: string;
        };
    };
}

interface FacebookUserInfoAndTokenInterface extends FacebookUserInfoInterface {
    token: FacebookUserTokenInterface;
}

/**
 * Returns a Google OAuth2 URI
 *
 * @param clientId Client ID
 *
 * @param redirectUri Redirect URI
 *
 * @param state
 *   A CSRF token
 *   Must be URI encoded. Tip: Use encodeURIComponent(state) when passing a state
 *   Specifies any string value that your application uses to maintain state
 *   between your authorization request and the authorization server's response.
 *   Will be added to userCreds upon authentication for you to check if
 *   it's equal to the one you provided here
 *
 * @param scopes List of scopes
 *   Default ['email', 'public_profile']
 *
 * @param responseType (Optional)
 *   One of: `code`, `token`, `id_token token`, `granted_scopes`
 *   Default: `code`
 *   Shouldn't need to change it unless you know what you're doing
 *
 */
export const getFacebookAuthUri = ({
    clientId,
    redirectUri,
    state,
    scopes = DEFAULT_SCOPE,
    responseType = 'code'
}: GetFacebookAuthUriInterface): string => {
    const baseUrl = new URL(`https://www.facebook.com/v${API_VERSION}/dialog/oauth`);
    const { searchParams } = baseUrl;
    searchParams.append('client_id', clientId);
    searchParams.append('redirect_uri', redirectUri);
    searchParams.append('scope', scopes.join(' '));
    searchParams.append('state', state);
    searchParams.append('response_type', encodeURIComponent(responseType));
    return baseUrl.toString();
};

/**
 * Returns facebook user token
 *
 * @param code code you get on your redirectUrl
 *
 * @param clientId clientId
 *
 * @param clientSecret clientSecret
 *
 * @param redirectUri same redirect URI as above
 *
 */
export const getFacebookUserToken = async ({
    code,
    clientId,
    clientSecret,
    redirectUri
}: GetFacebookUserTokenInterface): Promise<FacebookUserTokenInterface> => {
    const response = await superagent
        .get(`https://graph.facebook.com/v${API_VERSION}/oauth/access_token`)
        .query({ code })
        .query({ client_id: clientId })
        .query({ client_secret: clientSecret })
        .query({ redirect_uri: redirectUri });
    response.body.created_at = Date.now();
    return response.body;
};

const _getFacebookUserInfo = async (
    accessToken: string,
    meFields: string[]
): Promise<FacebookUserInfoInterface> => {
    const response = await superagent
        .get(`https://graph.facebook.com/v${API_VERSION}/me`)
        .set({ Accept: 'application/json' })
        .query({ fields: meFields.join(',') })
        .query({ access_token: accessToken });

    return response.body;
};

/**
 * Returns facebook user info + token
 *
 * @param code code you get on your redirectUrl
 *
 * @param clientId clientId
 *
 * @param clientSecret clientSecret
 *
 * @param redirectUri same redirect URI as above
 *
 * @param myFields (Optional)
 *   Choose one or many of:
 *       'email'
 *       'id'
 *       'first_name'
 *       'middle_name'
 *       'last_name'
 *       'name'
 *       'name_format'
 *       'short_name'
 *       'picture'
 *
 */
export const getFacebookUserInfo = async ({
    code,
    clientId,
    clientSecret,
    redirectUri,
    meFields = DEFAULT_ME_FIELDS
}: GetFacebookUserInfoInterface): Promise<FacebookUserInfoAndTokenInterface> => {
    const facebookUserToken = await getFacebookUserToken({
        code,
        clientId,
        clientSecret,
        redirectUri
    });

    const facebookUserInfo = await _getFacebookUserInfo(
        facebookUserToken.access_token,
        meFields
    );

    return {
        ...facebookUserInfo,
        token: facebookUserToken
    };
};
