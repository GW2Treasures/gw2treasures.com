<?php

use GW2Treasures\GW2Api\V2\Bulk\IBulkEndpoint;
use GW2Treasures\GW2Api\V2\Localization\ILocalizedEndpoint;

trait LoadsEntries
{
    public abstract function info($string);

    private function insertIntoDB( $table, $data ) {
        $count = count($data);

        if($count === 0) {
            return array();
        }

        $this->info('Inserting ' . $count . ' entries into database...');
        
        DB::table($table)->insert($count === 1 ? $data[0] : $data);
        return array();
    }

    public function loadEntries($name, IBulkEndpoint $endpoint, array $columns, $updating) {
        if(!($endpoint instanceof ILocalizedEndpoint)) {
            return;
        }

        $this->info('loading '.$name);

        $ids = $endpoint->ids();

        $count = count( $ids );
        $this->info( $count . ' '.$name.' loaded' );

        $this->info( 'loading known '.$name.' from database' );
        $knownIds = DB::table($name)->lists('id');
        $this->info( count( $knownIds ) . ' already known' );

        $this->info( 'loading '.$name.' details' );

        $unknownEntries = [];
        foreach( $ids as $id ) {
            if( !in_array( $id, $knownIds ) || $updating) {
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

            foreach($columns as $k => $v) {
                if(is_numeric($k) && is_string($v)) {
                    $column = $v;
                    $k = null;
                } elseif(is_string($k) && is_string($v)) {
                    $entryData[$k] = $entries_en[$id]->{$v};
                    continue;
                } else {
                    $entryData[$k] = $v($entries_de[$id], $entries_en[$id], $entries_es[$id], $entries_fr[$id]);
                    continue;
                }

                if(Str::endsWith($column, ['_de', '_en', '_es', '_fr'])) {
                    $strlen = strlen($column);
                    $columnName = substr($column, 0, $strlen - 3);
                    $lang = substr($column, $strlen - 2);

                    if($columnName === 'desc') {
                        $columnName = 'description';
                    }

                    $entry = ${'entries_' . $lang}[$id];
                    $entryData[$column] = $columnName === 'data'
                        ? json_encode($entry)
                        : (isset($entry->{$columnName}) ? $entry->{$columnName} : null);
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
                    $entryData[$column] = isset($entries_en[$id]->{$column}) ? $entries_en[$id]->{$column} : null;
                }
            }

            if($updating && in_array($id, $knownIds)) {
                if(array_key_exists('created_at', $entryData)) {
                    unset($entryData['created_at']);
                }
                DB::table($name)->where('id', '=', $id)->update($entryData);
            } else {
                $data[] = $entryData;
            }

            if( count( $data ) == 250 ) {
                $data = $this->insertIntoDB( $name, $data );
            }
        }
        $this->insertIntoDB( $name, $data );
        $this->info( 'Done.' );
    }
}
