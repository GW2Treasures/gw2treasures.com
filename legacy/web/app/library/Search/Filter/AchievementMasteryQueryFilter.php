<?php

class AchievementMasteryQueryFilter extends EnumSearchQueryFilter {
    protected static $REGIONS = [
        'Tyria' => 'Tyria',
        'Maguuma' => 'Maguuma (Path of Fire)',
        'Desert' => 'Crystal Desert (Heart of Thorns)',
        'Tundra' => 'Tundra (Icebrood Saga)'
    ];
    protected static $ANY = '*';

    public function __construct($name) {
        parent::__construct($name, [self::$ANY => 'Any mastery'] + self::$REGIONS);
    }

    public function query($query) {
        $value = $this->getValue();

        if($value && array_key_exists($value, self::$REGIONS)) {
            return $query->where('data_en', 'like', '%"type":"Mastery","region":"'. $value.'"%');
        } else if ($value === self::$ANY) {
            return $query->where('data_en', 'like', '%"type":"Mastery","region"%');
        }

        return $query;
    }
}
