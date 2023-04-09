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

    public function __construct() {
        parent::__construct();
    }
    
    public function fire() {
        if($this->option('debug-locked-text')) {
            return $this->debugLockedText();
        }

        $api = new GW2Api();
        $api->schema('2022-03-23T19:00:00.000Z');

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
            'total_ap' => function($data) { return $this->getTotalAp($data); }
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

        $this->info('Set historic flag');
        DB::table('achievements')->update(['historic' => true]);

        foreach(DB::table('achievement_categories')->get(['id', 'data_en', 'order']) as $cat) {
            $data = json_decode($cat->data_en);

            $achievementIds = Helper::collect($data->achievements)->lists('id');

            DB::table('achievements')->whereIn('id', $achievementIds)->update(['achievement_category_id' => $cat->id, 'historic' => false]);
            if($cat->order === 0) {
                DB::table('achievement_categories')->where('id', '=', $cat->id)->update(['order' => $data->order]);
            }
        };

        foreach(DB::table('achievement_groups')->get(['id', 'data_en']) as $group) {
            $categories = json_decode($group->data_en)->categories;
            DB::table('achievement_categories')->whereIn('id', $categories)->update(['achievement_group_id' => $group->id]);
        };

        $this->info('Load unlock statistics from gw2efficiency');
        $unlocks = json_decode(
            $api->getClient()
                ->request('GET', 'https://api.gw2efficiency.com/tracking/unlocks?id=achievements')
                ->getBody()
                ->getContents()
        );

        $this->info('Setup relations');
        Achievement::chunk(500, function($achievements) use ($unlocks) {
            $ids = $achievements->lists('id');

            $known = [
                'objectives' => Helper::collect(DB::table('achievement_objectives')->whereIn('achievement_id', $ids)->get())->groupBy('achievement_id'),
                'rewards' => Helper::collect(DB::table('achievement_rewards')->whereIn('achievement_id', $ids)->get())->groupBy('achievement_id'),
                'prerequisites' => Helper::collect(DB::table('achievement_prerequisites')->whereIn('achievement_id', $ids)->get())->groupBy('achievement_id'),
            ];

            $insert = [
                'objectives' => [],
                'rewards' => [],
                'prerequisites' => []
            ];

            /** @var Achievement $achievement */
            foreach($achievements as $achievement) {
                foreach(['objectives', 'rewards', 'prerequisites'] as $type) {
                    $current = [];

                    switch($type) {
                        case 'objectives':
                            $current = isset($achievement->getData()->bits) ? $achievement->getData()->bits : [];
                            break;
                        case 'rewards':
                            $current = isset($achievement->getData()->rewards) ? $achievement->getData()->rewards : [];
                            break;
                        case 'prerequisites':
                            $current = isset($achievement->getData()->prerequisites) ? $achievement->getData()->prerequisites : [];
                            break;
                    }

                    foreach($current as $entity) {
                        if(($type === 'objectives' || $type === 'rewards') && isset($entity->type) && in_array($entity->type, ['Item', 'Skin', 'Minipet'])) {
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
                        } elseif($type === 'prerequisites') {
                            $isKnown = false;
                            if($known[$type]->has($achievement->id)) {
                                foreach($known[$type][$achievement->id] as $knownEntity) {
                                    if($knownEntity->prerequisite_id === $entity) {
                                        $isKnown = true;
                                        break;
                                    }
                                }
                            }

                            if(!$isKnown) {
                                $entityData = [
                                    'achievement_id' => $achievement->id,
                                    'prerequisite_id' => $entity
                                ];
                                $insert[$type][] = $entityData;
                            }
                        }
                    }
                }

                $unlockedBy = isset($unlocks->data->{$achievement->id})
                    ? $unlocks->data->{$achievement->id} / $unlocks->total
                    : null;

                $achievement->unlocks = $unlockedBy;
                $achievement->save();
            }

            if(!empty($insert['objectives'])) {
                DB::table('achievement_objectives')->insert($insert['objectives']);
            }
            if(!empty($insert['rewards'])) {
                DB::table('achievement_rewards')->insert($insert['rewards']);
            }
            if(!empty($insert['prerequisites'])) {
                DB::table('achievement_prerequisites')->insert($insert['prerequisites']);
            }
        });

        $this->info('Set removed_from_api');
        Achievement::query()->update(['removed_from_api' => true]);
        Achievement::query()->whereIn('id', $api->achievements()->ids())->update(['removed_from_api' => false]);

        // clear achievement caches
        $this->info('Clear cache');
        Cache::forget(AchievementController::CACHE_OVERVIEW);
        Cache::forget(AchievementController::CACHE_DAILY);
        Cache::forget(AchievementController::CACHE_DAILY_TOMORROW);
    }

    protected function getOptions() {
        return [
            ['update', 'u', InputOption::VALUE_NONE, 'Update existing achievements'],
            ['debug-locked-text', null, InputOption::VALUE_NONE, 'Displays all locked_text without replacements']
        ];
    }

    protected function getTotalAp($achievement) {
        if(!isset($achievement->tiers)) {
            return 0;
        }

        return Helper::collect($achievement->tiers)->sum('points');
    }

    protected function debugLockedText() {
        $achievements = Achievement::where('data_en', 'LIKE', '%'.Achievement::FLAG_REQUIRES_UNLOCK.'%')->get();

        foreach($achievements as $achievement) {
            $text = $achievement->highlightLockedText();

            if($text === $achievement->getData()->locked_text && $text !== '') {
                $this->info("[$achievement->id] $text");
            }
        }
    }
}
