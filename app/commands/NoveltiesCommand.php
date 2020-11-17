<?php

use Illuminate\Console\Command;
use GW2Treasures\GW2Api\GW2Api;
use Symfony\Component\Console\Input\InputOption;

class NoveltiesCommand extends Command {
    use LoadsEntries;

    protected $name = 'gw2treasures:novelties';
    protected $description = 'Load Novelties from API and store in database';

    public function fire() {
        $api = new GW2Api();

        $updating = $this->option('update');

        if($updating) {
            $this->info('updating existing entries');
        }

        $this->loadEntries('novelties', $api->novelties(), [
            'name_de', 'name_en', 'name_es', 'name_fr',
            'slot', 'signature', 'file_id',
            'description_de', 'description_en', 'description_es', 'description_fr',
            'data_de', 'data_en', 'data_es', 'data_fr',
            'created_at', 'updated_at',
        ], $updating);

        $unlocks = json_decode(
            $api->getClient()
                ->request('GET', 'https://api.gw2efficiency.com/tracking/unlocks?id=novelties')
                ->getBody()
                ->getContents()
        );

        Novelty::chunk(100, function ( $novelties ) use ( $unlocks ) {
            $inserts = [];

            $ids = $novelties->lists('id');

            $known = Helper::collect(DB::table('novelty_unlock_items')->whereIn('novelty_id', $ids)->get())->groupBy('novelty_id');

            /** @var Novelty $achievement */
            foreach( $novelties as $novelty ) {
                $unlockItems = $novelty->getData()->unlock_item;

                foreach($unlockItems as $unlockItem) {
                    $isKnown = false;

                    if($known->has($novelty->id)) {
                        foreach($known[$novelty->id] as $unlock) {
                            if($unlock->item_id == $unlockItem) {
                                $isKnown = true;
                                break;
                            }
                        }
                    }

                    if(!$isKnown) {
                        $inserts[] = [
                            'novelty_id' => $novelty->id,
                            'item_id' => $unlockItem
                        ];
                    }
                }

                $unlockedBy = isset($unlocks->data->{$novelty->id})
                    ? $unlocks->data->{$novelty->id} / $unlocks->total
                    : null;

                $novelty->unlocks = $unlockedBy;
                $novelty->save();
            }

            if(!empty($inserts)) {
                $this->info('Inserting '.count($inserts).' unlock items into database...');
                DB::table('novelty_unlock_items')->insert($inserts);
                $this->info('Done.');
            }
        });
    }

    protected function getOptions() {
        return [
            ['update', 'u', InputOption::VALUE_NONE, 'Update existing Materials']
        ];
    }
}
