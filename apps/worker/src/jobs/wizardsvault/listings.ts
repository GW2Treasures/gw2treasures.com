import { db } from '../../db';
import { fetchApi } from '../helper/fetchApi';
import { Job } from '../job';
import { isEmptyObject } from '@gw2treasures/helper/is';
import { type ProcessEntitiesData, createSubJobs, processEntities } from '../helper/process-entities';
import { Prisma } from '@gw2treasures/database';
import { loadWizardsVaultListings } from '../helper/loadWizardsVaultListings';
import { toId } from '../helper/toId';

interface WizardsVaultListingsJobProps extends ProcessEntitiesData<number> {}

export const WizardsVaultListingsJob: Job = {
  async run(data: WizardsVaultListingsJobProps | Record<string, never>) {
    const CURRENT_VERSION = 1;

    if(isEmptyObject(data)) {
      return createSubJobs(
        'wizardsvault.listings',
        () => fetchApi<number[]>('/v2/wizardsvault/listings'),
        db.wizardsVaultListing.findMany,
        CURRENT_VERSION
      );
    }

    const knownItemIds = (await db.item.findMany({ select: { id: true }})).map(toId);

    return processEntities(
      data,
      'WizardsVaultListing',
      (listingId, revisionId) => ({ wizardsVaultListingId_revisionId: { revisionId, wizardsVaultListingId: listingId }}),
      (listing) => {
        return {
          itemIdRaw: listing.item_id,
          itemId: knownItemIds.includes(listing.item_id) ? listing.item_id : undefined,
          count: listing.item_count,
          cost: listing.cost,
          type: listing.type,
        } satisfies Prisma.WizardsVaultListingUncheckedUpdateInput;
      },
      db.wizardsVaultListing.findMany,
      loadWizardsVaultListings,
      (tx, data) => tx.wizardsVaultListing.create(data),
      (tx, data) => tx.wizardsVaultListing.update(data),
      CURRENT_VERSION
    );
  }
};
