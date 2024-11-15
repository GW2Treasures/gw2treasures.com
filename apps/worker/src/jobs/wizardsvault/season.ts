import { db } from '../../db';
import { fetchApi } from '../helper/fetchApi';
import { getCurrentBuild } from '../helper/getCurrentBuild';
import { createRevisions } from '../helper/revision';
import { Job } from '../job';
import { schema } from '../helper/schema';

export const WizardsVaultSeasonJob: Job = {
  async run() {
    const now = new Date();
    const oneHourAgo = new Date(now);
    oneHourAgo.setMinutes(oneHourAgo.getMinutes() - 60);

    const { id: buildId } = await getCurrentBuild();

    const season = await db.wizardsVaultSeason.findFirst({
      where: { start: { lte: now }, end: { gt: now }},
      include: { current_de: true, current_en: true, current_es: true, current_fr: true }
    });

    if(!season) {
      console.log('Found no active season in db');
    }

    const en = await fetchApi('/v2/wizardsvault', { language: 'en' });

    const apiSeasonStart = new Date(en.start);
    const apiSeasonEnd = new Date(en.end);

    if(apiSeasonStart > now || apiSeasonEnd <= now) {
      throw new Error('Invalid Wizard\'s Vault season received, start/end interval does not contain current');
    }

    const isNew = !season || (apiSeasonStart.valueOf() !== season.start.valueOf());
    const needsUpdate = isNew || season.lastCheckedAt < oneHourAgo;

    if(!needsUpdate) {
      return 'Wizard\'s Vault season unchanged';
    }

    const [de, es, fr] = await Promise.all([
      fetchApi('/v2/wizardsvault', { language: 'de' }),
      fetchApi('/v2/wizardsvault', { language: 'es' }),
      fetchApi('/v2/wizardsvault', { language: 'fr' }),
    ]);

    if(isNew) {
      const revisions = await createRevisions({ de, en, es, fr }, { buildId, type: 'Added', entity: 'WizardsVaultSeason', description: 'Added to API' });

      await db.wizardsVaultSeason.create({
        data: {
          start: apiSeasonStart,
          end: apiSeasonEnd,
          name_de: de.title,
          name_en: en.title,
          name_es: es.title,
          name_fr: fr.title,

          currentId_de: revisions.de.id,
          currentId_en: revisions.en.id,
          currentId_es: revisions.es.id,
          currentId_fr: revisions.fr.id,
          lastCheckedAt: new Date(),
          history: { createMany: { data: [{ revisionId: revisions.de.id }, { revisionId: revisions.en.id }, { revisionId: revisions.es.id }, { revisionId: revisions.fr.id }] }},
        }
      });

      return 'Discovered new Wizard\'s Vault Season';
    }

    const changed_de = season.current_de.data !== JSON.stringify(de);
    const changed_en = season.current_en.data !== JSON.stringify(en);
    const changed_es = season.current_es.data !== JSON.stringify(es);
    const changed_fr = season.current_fr.data !== JSON.stringify(fr);

    if(!changed_de && !changed_en && !changed_es && !changed_fr) {
      // nothing changed
      await db.wizardsVaultSeason.update({ data: { lastCheckedAt: new Date() }, where: { id: season.id }});
      return 'Wizard\'s Vault season unchanged';
    }

    const revision_de = changed_de ? await db.revision.create({ data: { data: JSON.stringify(de), language: 'de', buildId, type: 'Update', entity: 'WizardsVaultSeason', description: 'Updated in API', previousRevisionId: season.currentId_de, schema }}) : season.current_de;
    const revision_en = changed_en ? await db.revision.create({ data: { data: JSON.stringify(en), language: 'en', buildId, type: 'Update', entity: 'WizardsVaultSeason', description: 'Updated in API', previousRevisionId: season.currentId_en, schema }}) : season.current_en;
    const revision_es = changed_es ? await db.revision.create({ data: { data: JSON.stringify(es), language: 'es', buildId, type: 'Update', entity: 'WizardsVaultSeason', description: 'Updated in API', previousRevisionId: season.currentId_es, schema }}) : season.current_es;
    const revision_fr = changed_fr ? await db.revision.create({ data: { data: JSON.stringify(fr), language: 'fr', buildId, type: 'Update', entity: 'WizardsVaultSeason', description: 'Updated in API', previousRevisionId: season.currentId_fr, schema }}) : season.current_fr;

    await db.wizardsVaultSeason.update({
      where: { id: season.id },
      data: {
        start: apiSeasonStart,
        end: apiSeasonEnd,
        name_de: de.title,
        name_en: en.title,
        name_es: es.title,
        name_fr: fr.title,

        currentId_de: revision_de.id,
        currentId_en: revision_en.id,
        currentId_es: revision_es.id,
        currentId_fr: revision_fr.id,
        lastCheckedAt: new Date(),
        history: { createMany: { data: [{ revisionId: revision_de.id }, { revisionId: revision_en.id }, { revisionId: revision_es.id }, { revisionId: revision_fr.id }], skipDuplicates: true }}
      }
    });

    return 'Updated Wizard\'s Vault Season';
  }
};
