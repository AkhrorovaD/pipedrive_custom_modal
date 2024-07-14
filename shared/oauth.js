import { getCookie, setCookie } from 'cookies-next';
import { ApiClient, UsersApi } from 'pipedrive';
import db from './db';
import logger from './logger';
import JobModal from '../components/JobModal';
const log = logger('OAuth 🔒');

// Initialize the API client
export const initAPIClient = ({ accessToken = '', refreshToken = '' }) => {
  const client = new ApiClient();
  const oAuth2 = client.authentications.oauth2;

  // Set the Client Credentials based on the Pipedrive App details
  oAuth2.clientId = process.env.CLIENT_ID;
  oAuth2.clientSecret = process.env.CLIENT_SECRET;
  oAuth2.redirectUri = process.env.REDIRECT_URL;
  if (accessToken) oAuth2.accessToken = accessToken;
  if (refreshToken) oAuth2.refreshToken = refreshToken;

  return client;
};

// Gets the API client based on session cookies
export const getAPIClient = (req, res) => {
  const session = getCookie('session', { req, res });
  return initAPIClient({
    accessToken: JSON.parse(session).token,
  });
};

// Generate the authorization URL for the 1st step
export const getAuthorizationUrl = (client) => {
  const authUrl = client.buildAuthorizationUrl();
  log.info('Authorization URL generated');
  return authUrl;
};

// Get the currently authorized user details
export const getLoggedInUser = async (client) => {
  const api = new UsersApi(client);
  const data = await api.getCurrentUser();
  log.info('Currently logged-in user details obtained');
  return data;
};

// Update Access and Refresh tokens
export const updateTokens = (client, token) => {
  log.info('Updating access + refresh token details');
  const oAuth2 = client.authentications.oauth2;
  oAuth2.accessToken = token.access_token;
  oAuth2.refreshToken = token.refresh_token;
};

// Get Session Details
export const initalizeSession = async (req, res, userId) => {
  try {
    // 1.1 Check if the session cookie is already set
    log.info(`Checking if a session cookie is set for ${userId}`);
    const session = getCookie('session', { req, res });

    // 1.2. If the session is not set, get the user ID value from the query params
    if (!session) {
      log.info(
        'Session cookie is not found. Checking the database for OAuth details'
      );
      const account = await db.user.findUnique({
        where: {
          accountId: String(userId),
        },
      });
      // 1.3. If no entry exists in DB, the user hasn't even authorized once
      if (!account) {
        log.info('No matching account found. You need to authorize the app 🔑');
        return { auth: false };
      } else if (Date.now() > parseInt(account.expiresAt)) {
        log.info('Account details found. Access token has expired');
        const client = initAPIClient(account);
        const refreshed = await client.refreshToken();
        log.info('Token successfully refreshed');
        await db.user.update({
          where: {
            accountId: userId,
          },
          data: {
            accessToken: refreshed.access_token,
            refreshToken: refreshed.refresh_token,
            expiresAt: String(Date.now() + 59 * 60 * 1000),
          },
        });
        log.info('Database updated. Session cookie set 🍪');
        return setSessionCookie(
          true,
          account.accountId,
          account.name,
          refreshed.access_token,
          String(Date.now() + 59 * 60 * 1000),
          req,
          res
        );
      } else {
        log.info('Access token is valid. Session cookie set 🍪');
        // 1.5. Return this value to the app.
        // Make sure to set the cookie lifetime only for the remaining validity time of the access token
        return setSessionCookie(
          true,
          account.accountId,
          account.name,
          account.accessToken,
          account.expiresAt,
          req,
          res
        );
      }
    } else {
      // 2. Simply return the existing session details :)
      log.info('Session cookie found 🍪');
      return JSON.parse(session);
    }
  } catch (error) {
    log.error("Couldn't create session :[");
    log.error(error);
  }
};

// Set cookies
const setSessionCookie = (auth, id, name, token, expiry, req, res) => {
  const newSession = {
    auth,
    id,
    name,
    token,
  };

  const cookieParams = {
    maxAge: Math.round((parseInt(expiry) - Date.now()) / 1000),
    sameSite: 'none',
    secure: true,
    req,
    res,
  };
  // 1.4. Set the cookie
  setCookie('session', JSON.stringify(newSession), cookieParams);

  return newSession;
};

export const addDeal = async (data, req, res) => {
  try {
    log.info('Initializing API client...');
    const client = getAPIClient(req, res);

    log.info('API client initialized. Creating DealsApi instance...');
    const api = new DealsApi(client);

    log.info('Preparing deal data...');
    const dealData = {
      title: `${data.job_type} - ${data.first_name} ${data.last_name}`,
      value: 0,
      currency: 'USD',
      person_id: null,
      org_id: 1,
      stage_id: 1,
      status: 'open',
      add_time: new Date().toISOString(),
      "e158b4e8f07d4c057a3003b82841719d4dfe5196": data.first_name,
      "9151c7c54e7733159c72d691fa67f6e1445ca6fa": data.last_name,
      "685cc9c841df2db735acd4c9bc497a766d69d27e": data.phone,
      "63d1d9b18d273fcb804112c2008cb3a2744c78b2": data.job_type,
      "9846a72dfa96bf2d4bb84b7e14d0be94fc5973e6": data.email,
      "23f00f4412a65cee3569c7150088bafd901b92a6": data.job_source,
      "509d68ce0b095cca6dd2103808227a9d4ee7e4d1": data.job_description,
      "933830c0d24b9d8765689935fa6a88ad15704b3a": data.address,
      "f1564598d08cba545d77ca7963b1d528ccb2220f": data.city,
      "77fc9d7c4bdd0029c2dde50aeb02de7c6a5b1ee3": data.state,
      "34bfe1e8a3f2d74bf67107ab260ebdeda47fec74": data.zip_code,
      "f83e3c352f3f2c040ef5f9c6719d0c267c10973f": data.area,
      "a9cc5e8655a22d96eef7a3d5b3ce8137a28a5005": data.start_date,
      "55cbc09a6ab0ed21bdd852f5012650e953e42e56": data.start_time,
      "0d78e86fc8eb5b23d0236110588e9c586ed5b8f0": data.end_time,
      "4d0422efa136a93a8b391dce1f1d6aec13fe7bc4": data.test_select
    };

    log.info('Deal data prepared:', dealData);

    log.info('Adding deal via Pipedrive API...');
    const response = await api.addDeal(dealData);
    
    log.info('Deal was added successfully!', response);
    res.status(200).json(response);
  } catch (err) {
    const errorToLog = err.context?.body || err;
    log.error('Adding deal failed', errorToLog);
    res.status(500).json({ error: 'Failed to add deal', details: errorToLog });
  }
};