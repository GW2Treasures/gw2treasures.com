<?php

use GW2Treasures\GW2Api\V2\Bulk\IBulkEndpoint;
use GW2Treasures\GW2Api\V2\Endpoint;
use GW2Treasures\GW2Api\V2\Localization\ILocalizedEndpoint;
use GW2Treasures\GW2Api\V2\Pagination\IPaginatedEndpoint;
use Illuminate\Console\Command;
use GW2Treasures\GW2Api\GW2Api;
use Illuminate\Support\Collection;

class AchievementsCommand extends Command {
    protected $name = 'gw2treasures:achievements';
    protected $description = 'Load Achievements from API and store in database';

    public function __construct()
    {
        parent::__construct();
    }

    private function insertIntoDB( $table, $data ) {
        if( count( $data ) == 0 ) {
            return array();
        }
        $this->info('Inserting ' . count( $data ) . ' entries into database...');
        DB::table($table)->insert( $data );
        return array();
    }

    public function fire() {
        $api = new GW2Api();

        $this->loadEntries('achievements', $api->achievements(), [
            'name_de', 'name_en', 'name_es', 'name_fr',
            'description_de', 'description_en', 'description_es', 'description_fr',
            'requirement_de', 'requirement_en', 'requirement_es', 'requirement_fr',
            'type', 'signature', 'file_id',
            'data_de', 'data_en', 'data_es', 'data_fr',
            'created_at', 'updated_at',
        ]);

        $this->loadEntries('achievement_categories', $api->achievements()->categories(), [
            'name_de', 'name_en', 'name_es', 'name_fr',
            'description_de', 'description_en', 'description_es', 'description_fr',
            'signature', 'file_id',
            'data_de', 'data_en', 'data_es', 'data_fr',
            'created_at', 'updated_at',
        ]);

        $this->loadEntries('achievement_groups', $api->achievements()->groups(), [
            'name_de', 'name_en', 'name_es', 'name_fr',
            'description_de', 'description_en', 'description_es', 'description_fr',
            'order', 'data_de', 'data_en', 'data_es', 'data_fr',
            'created_at', 'updated_at',
        ]);

        foreach(DB::table('achievement_categories')->get(['id', 'data_en']) as $cat) {
            $achievements = json_decode($cat->data_en)->achievements;
            DB::table('achievements')->whereIn('id', $achievements)->update(['achievement_category_id' => $cat->id]);
        };

        foreach(DB::table('achievement_groups')->get(['id', 'data_en']) as $group) {
            $categories = json_decode($group->data_en)->categories;
            DB::table('achievement_categories')->whereIn('id', $categories)->update(['achievement_group_id' => $group->id]);
        };

        Achievement::chunk(500, function($achievements) {
            $ids = $achievements->lists('id');

            $achievement_objectives =
                (new Collection(DB::table('achievement_objectives')->whereIn('achievement_id', $ids)->get()))->groupBy('achievement_id');

            $insert = [];

            /** @var Achievement $achievement */
            foreach($achievements as $achievement) {
                $objectives = isset($achievement->getData()->bits)
                    ? $achievement->getData()->bits
                    : [];

                foreach($objectives as $objective) {
                    if(in_array($objective->type, ['Item', 'Skin', 'Minipet'])) {
                        $type = strtolower($objective->type);
                        $isKnown = false;
                        if($achievement_objectives->has($achievement->id)) {
                            foreach($achievement_objectives[$achievement->id] as $knownObjective) {
                                if($knownObjective->type == $type && $knownObjective->entity_id == $objective->id) {
                                    $isKnown = true;
                                    break;
                                }
                            }
                        }
                        if(!$isKnown) {
                            $insert[] = [
                                'type' => $type,
                                'entity_id' => $objective->id,
                                'achievement_id' => $achievement->id
                            ];
                        }
                    }
                }
            }

            if(!empty($insert)) {
                DB::table('achievement_objectives')->insert($insert);
            }
        });

        // clear achievement caches
        Cache::forget(AchievementController::CACHE_OVERVIEW);
        Cache::forget(AchievementController::CACHE_DAILY);
    }

    public function loadEntries($name, IBulkEndpoint $endpoint, array $columns) {
        if(!($endpoint instanceof ILocalizedEndpoint)) {
            return;
        }

        $this->info('laoding '.$name);

        $ids = $endpoint->ids();

        $count = count( $ids );
        $this->info( $count . ' achievements loaded' );

        $this->info( 'loading known '.$name.' from database' );
        $knownIds = DB::table($name)->lists('id');
        $this->info( count( $knownIds ) . ' already known' );

        $this->info( 'loading '.$name.' details' );

        $unknownEntries = [];
        foreach( $ids as $id ) {
            if( !in_array( $id, $knownIds )) {
                $unknownEntries[] = $id;
            }
        }

        $keyByID = function(array $entries) {
            $results = [];

            foreach($entries as $entry) {
                $results[$entry->id] = $entry;
            }

            return $results;
        };

        $entries_de = $keyByID($endpoint->lang('de')->many($unknownEntries));
        $entries_en = $keyByID($endpoint->lang('en')->many($unknownEntries));
        $entries_es = $keyByID($endpoint->lang('es')->many($unknownEntries));
        $entries_fr = $keyByID($endpoint->lang('fr')->many($unknownEntries));

        $data = [];

        foreach( $unknownEntries as $i => $id ) {
            if( !isset( $entries_en[$id]->name ) ) {
                continue;
            }

            $this->info( '(' . ($i + 1) . '/' . $count . ') Loading [' . $id . '] ' . $entries_en[$id]->name );

            $entryData = ['id' => $id];

            foreach($columns as $column) {
                if(Str::endsWith($column, ['_de', '_en', '_es', '_fr'])) {
                    $strlen = strlen($column);
                    $columnName = substr($column, 0, $strlen - 3);
                    $lang = substr($column, $strlen - 2);

                    $entry = ${'entries_' . $lang}[$id];
                    $entryData[$column] = $columnName === 'data'
                        ? json_encode($entry)
                        : $entry->{$columnName};
                } elseif($column === 'signature' || $column === 'file_id') {
                    if( isset($entries_en[$id]->icon) ) {
                        preg_match('/\/(?<signature>[^\/]*)\/(?<file_id>[^\/]*)\.png$/', $entries_en[$id]->icon, $icon);
                        $entryData[$column] = $icon[$column];
                    } else {
                        $entryData[$column] = $column === 'file_id' ? 0 : '';
                    }
                } elseif($column === 'created_at' || $column === 'updated_at') {
                    $entryData[$column] = date('Y-m-d H:i:s');
                } else {
                    $entryData[$column] = $entries_en[$id]->{$column};
                }
            }

            $data[] = $entryData;

            if( count( $data ) == 250 ) {
                $data = $this->insertIntoDB( $name, $data );
            }
        }
        $this->insertIntoDB( $name, $data );
        $this->info( 'Done.' );
    }
}
