import { db } from '../../db';
import { createEntityJobs } from '../../entityJobs';

const jobs = createEntityJobs('items', 'Item', '/v2/items', db.item);

export const ItemsCheck = jobs['items.check'];
export const ItemsRemoved = jobs['items.removed'];
