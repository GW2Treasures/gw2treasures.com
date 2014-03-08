<?php

class Match extends BaseModel {
	const REGION_US = 'us';
	const REGION_EU = 'eu';

	public function getRegion() {
		return $this->match_id[0] == '1' ? self::REGION_US : self::REGION_EU;
	}

	public static function getWorldName( $world_id, $lang = null ) {
		if( is_null( $lang )) {
			$lang = App::getLocale();
		}

		$json = Cache::rememberForever( 'world_names.json?lang=' . $lang, function() use ( $lang ) {
			return file_get_contents( 'https://api.guildwars2.com/v1/world_names.json?lang=' . $lang );
		});
		$worlds = json_decode( $json );
		foreach( $worlds as $world ) {
			if( $world->id == $world_id ) {
				return $world->name;
			}
		}

		return 'UNKNOWN';
	}
}