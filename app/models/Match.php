<?php

use Carbon\Carbon;

/**
 * Match
 *
 * @property integer $id 
 * @property string $match_id 
 * @property string $start_time 
 * @property string $end_time 
 * @property string $data 
 * @property \Carbon\Carbon $created_at 
 * @property \Carbon\Carbon $updated_at 
 * @property-read \Illuminate\Database\Eloquent\Collection|World[] $worlds 
 * @property-read mixed $region 
 * @method static \Illuminate\Database\Query\Builder|\Match whereId($value)
 * @method static \Illuminate\Database\Query\Builder|\Match whereMatchId($value)
 * @method static \Illuminate\Database\Query\Builder|\Match whereStartTime($value)
 * @method static \Illuminate\Database\Query\Builder|\Match whereEndTime($value)
 * @method static \Illuminate\Database\Query\Builder|\Match whereData($value)
 * @method static \Illuminate\Database\Query\Builder|\Match whereCreatedAt($value)
 * @method static \Illuminate\Database\Query\Builder|\Match whereUpdatedAt($value)
 * @method static \Match current()
 * @method static \BaseModel random($count = 1)
 */
class Match extends BaseModel {
    use HasData;

	const REGION_US = 'us';
	const REGION_EU = 'eu';

	const TEAM_RED   = 'red';
	const TEAM_GREEN = 'green';
	const TEAM_BLUE  = 'blue';

	const NEUTRAL = 'neutral';

	const OBJECTIVE_CAMP = 'Camp';
	const OBJECTIVE_TOWER = 'Tower';
	const OBJECTIVE_KEEP = 'Keep';
	const OBJECTIVE_CASTLE = 'Castle';

	protected $appends = ['region'];

	public function worlds() {
	    //return $this->hasMany(MatchWorld::class);
        return $this->belongsToMany(World::class, 'match_worlds')->withPivot('team');
    }

    public function scopeCurrent($query) {
	    return $query->where(function($query) {
	        $query->where('start_time', '<', Carbon::now())->where('end_time', '>', Carbon::now());
        });
    }

    public function getRegionAttribute() {
        return $this->match_id[0] == '1' ? self::REGION_US : self::REGION_EU;
    }

    public function getScore($team) {
	    $data = $this->getData();

	    return $data->scores->{$team};
    }

    public function getIncome($team) {
        $this->parseObjectives();

        return $this->income[$team];
    }

    public function getVictoryPoints($team) {
        $data = $this->getData();

        return $data->victory_points->{$team};
    }

    public function getLatestSkirmishPoints($team) {
	    $data = $this->getData();

	    return Helper::collect($data->skirmishes)->sortByDesc('id')->first()->scores->{$team};
    }

    public function getObjectiveCount($team, $type) {
	    $this->parseObjectives();

	    return $this->objectiveCounts[$team][$type];
    }

    protected $objectiveCounts;
	protected $income;

    protected function parseObjectives() {
        $this->objectiveCounts = [
            Match::TEAM_RED => ['Ruins' => 0, 'Spawn' => 0, 'Camp' => 0, 'Keep' => 0, 'Tower' => 0, 'Castle' => 0],
            Match::TEAM_GREEN => ['Ruins' => 0, 'Spawn' => 0, 'Camp' => 0, 'Keep' => 0, 'Tower' => 0, 'Castle' => 0],
            Match::TEAM_BLUE => ['Ruins' => 0, 'Spawn' => 0, 'Camp' => 0, 'Keep' => 0, 'Tower' => 0, 'Castle' => 0]
        ];

        $this->income = [
            Match::TEAM_RED => 0,
            Match::TEAM_GREEN => 0,
            Match::TEAM_BLUE => 0
        ];

        foreach ($this->getData()->maps as $map) {
            foreach($map->objectives as $objective) {
                $owner = strtolower($objective->owner);

                if($owner !== Match::NEUTRAL) {
                    $this->income[strtolower($objective->owner)] += $objective->points_tick;
                    $this->objectiveCounts[strtolower($objective->owner)][$objective->type] += 1;
                }
            }
        }
    }
}
