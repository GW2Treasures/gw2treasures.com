<?php

use GW2Treasures\GW2Api\V2\Bulk\IBulkEndpoint;
use GW2Treasures\GW2Api\V2\Endpoint;
use GW2Treasures\GW2Api\V2\Localization\ILocalizedEndpoint;
use GW2Treasures\GW2Api\V2\Pagination\IPaginatedEndpoint;
use Illuminate\Console\Command;
use GW2Treasures\GW2Api\GW2Api;
use Illuminate\Support\Collection;
use Symfony\Component\Console\Input\InputOption;

class AchievementsCommand extends Command {
    use LoadsEntries;

    protected $name = 'gw2treasures:achievements';
    protected $description = 'Load Achievements from API and store in database';

    public function __construct()
    {
        parent::__construct();
    }
    
    public function fire() {
        $api = new GW2Api();

        $updating = $this->option('update');

        if($updating) {
            $this->info('updating existing entries');
        }

        $this->loadEntries('achievements', $api->achievements(), [
            'name_de', 'name_en', 'name_es', 'name_fr',
            'description_de', 'description_en', 'description_es', 'description_fr',
            'requirement_de', 'requirement_en', 'requirement_es', 'requirement_fr',
            'type', 'signature', 'file_id',
            'data_de', 'data_en', 'data_es', 'data_fr',
            'created_at', 'updated_at',
        ], $updating);

        $this->loadEntries('achievement_categories', $api->achievements()->categories(), [
            'name_de', 'name_en', 'name_es', 'name_fr',
            'description_de', 'description_en', 'description_es', 'description_fr',
            'signature', 'file_id', 'order',
            'data_de', 'data_en', 'data_es', 'data_fr',
            'created_at', 'updated_at',
        ], $updating);

        $this->loadEntries('achievement_groups', $api->achievements()->groups(), [
            'name_de', 'name_en', 'name_es', 'name_fr',
            'description_de', 'description_en', 'description_es', 'description_fr',
            'order', 'data_de', 'data_en', 'data_es', 'data_fr',
            'created_at', 'updated_at',
        ], $updating);

        foreach(DB::table('achievement_categories')->get(['id', 'data_en', 'order']) as $cat) {
            $data = json_decode($cat->data_en);
            DB::table('achievements')->whereIn('id', $data->achievements)->update(['achievement_category_id' => $cat->id]);
            if($cat->order === 0) {
                DB::table('achievement_categories')->where('id', '=', $cat->id)->update(['order' => $data->order]);
            }
        };

        foreach(DB::table('achievement_groups')->get(['id', 'data_en']) as $group) {
            $categories = json_decode($group->data_en)->categories;
            DB::table('achievement_categories')->whereIn('id', $categories)->update(['achievement_group_id' => $group->id]);
        };

        Achievement::chunk(500, function($achievements) {
            $ids = $achievements->lists('id');

            $known = [
                'objectives' => (new Collection(DB::table('achievement_objectives')->whereIn('achievement_id', $ids)->get()))->groupBy('achievement_id'),
                'rewards' => (new Collection(DB::table('achievement_rewards')->whereIn('achievement_id', $ids)->get()))->groupBy('achievement_id')
            ];

            $insert = [
                'objectives' => [],
                'rewards' => []
            ];

            /** @var Achievement $achievement */
            foreach($achievements as $achievement) {
                foreach(['objectives', 'rewards'] as $type) {
                    $current = $type === 'objectives'
                        ? ( isset($achievement->getData()->bits) ? $achievement->getData()->bits : [] )
                        : ( isset($achievement->getData()->rewards) ? $achievement->getData()->rewards : []);

                    foreach($current as $entity) {
                        if(in_array($entity->type, ['Item', 'Skin', 'Minipet'])) {
                            $entityType = strtolower($entity->type);
                            $isKnown = false;
                            if($known[$type]->has($achievement->id)) {
                                foreach($known[$type][$achievement->id] as $knownEntity) {
                                    if($knownEntity->type == $entityType && $knownEntity->entity_id == $entity->id) {
                                        $isKnown = true;
                                        break;
                                    }
                                }
                            }

                            if(!$isKnown) {
                                $entityData = [
                                    'type' => $entityType,
                                    'entity_id' => $entity->id,
                                    'achievement_id' => $achievement->id,
                                ];
                                if($type === 'rewards') {
                                    $entityData['count'] = $entity->count;
                                }
                                $insert[$type][] = $entityData;
                            }
                        }
                    }
                }
            }

            if(!empty($insert['objectives'])) {
                DB::table('achievement_objectives')->insert($insert['objectives']);
            }
            if(!empty($insert['rewards'])) {
                DB::table('achievement_rewards')->insert($insert['rewards']);
            }
        });

        // clear achievement caches
        Cache::forget(AchievementController::CACHE_OVERVIEW);
        Cache::forget(AchievementController::CACHE_DAILY);
    }

    protected function getOptions() {
        return [
            ['update', 'u', InputOption::VALUE_NONE, 'Update existing achievements']
        ];
    }


}
