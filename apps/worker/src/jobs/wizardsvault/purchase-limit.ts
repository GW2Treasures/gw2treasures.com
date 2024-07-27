import { db } from '../../db';
import { fetchApi } from '../helper/fetchApi';
import { groupEntitiesById } from '../helper/groupById';
import { Job } from '../job';

export const WizardsVaultPurchaseLimitJob: Job = {
  async run() {
    const apiKey = process.env.WORKER_GW2_API_KEY;

    if(!apiKey) {
      throw new Error('GW2 API key not set.');
    }

    const apiListings = await fetchApi('/v2/account/wizardsvault/listings', { accessToken: apiKey });
    const dbListings = await db.wizardsVaultListing.findMany({ where: { removedFromApi: false }});

    const listingsById = groupEntitiesById(dbListings);

    let updated = 0;

    for(const listing of apiListings) {
      const limit = listing.purchase_limit ?? null;
      const dbListing = listingsById.get(listing.id);

      if(!dbListing) {
        console.warn(`Found listing ${listing.id} in /v2/account/wizardsvault/listings but not in db`);
      } else {
        if(limit !== dbListing.limit) {
          await db.wizardsVaultListing.updateMany({
            where: { id: listing.id },
            data: { limit }
          });
          updated++;
        }
      }
    }

    return `Updated purchase limit of ${updated} entries`;
  }
};
