import { Gw2MeClient } from '@gw2me/client';

const client_id = process.env.GW2ME_CLIENT_ID!;
const client_secret = process.env.GW2ME_CLIENT_SECRET;
const url = process.env.GW2ME_URL;

export const gw2me = new Gw2MeClient({ client_id, client_secret }, { url });
