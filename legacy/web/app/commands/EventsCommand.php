<?php

use GW2Treasures\GW2Api\GW2Api;
use GW2Treasures\GW2Api\V2\Bulk\IBulkEndpoint;
use GW2Treasures\GW2Api\V2\Localization\ILocalizedEndpoint;
use Illuminate\Console\Command;
use Symfony\Component\Console\Input\InputOption;

class EventsCommand extends Command {
    use LoadsEntries;

	/**
	 * The console command name.
	 *
	 * @var string
	 */
	protected $name = 'gw2treasures:events';

	/**
	 * The console command description.
	 *
	 * @var string
	 */
	protected $description = 'Loads events from the official API and stores them in the database.';

    public function fire()
    {
        $updating = $this->option('update');

        $this->loadEntries('events', new EventsApi(), [
            'name_de', 'name_en', 'name_es', 'name_fr',
            'map_id', 'level', 'signature', 'file_id',
            'data_de', 'data_en', 'data_es', 'data_fr',
            'created_at', 'updated_at'
        ], $updating);
    }

    protected function getOptions() {
        return [
            ['update', 'u', InputOption::VALUE_NONE, 'Update existing events']
        ];
    }
}

class EventsApi implements IBulkEndpoint, ILocalizedEndpoint {
    private $events = [];
    private $language = 'en';
    private $schema = '';

    public function __construct() {
    }

    /**
     * @return \Illuminate\Support\Collection
     */
    private function getEvents() {
        $l = $this->language;

        if(!isset($events[$l])) {
            $api = new GW2Api();

            $this->events[$l] = Helper::collect((array)(json_decode(
                $api->getClient()
                    ->request('GET', 'https://api.guildwars2.com/v1/event_details.json?lang='.$l)
                    ->getBody()
                    ->getContents()
            )->events))->map(function($event, $id) {
                $event->id = $id;

                if(isset($event->icon)) {
                    $event->icon = '/'.$event->icon->signature.'/'.$event->icon->file_id.'.png';
                }

                return $event;
            })->keyBy('id');
        }

        return $this->events[$l];
    }


    /**
     * All ids.
     *
     * @return string[]|int[]
     */
    public function ids() {
        return $this->getEvents()->keys();
    }

    /**
     * Single entry by id.
     *
     * @param int|string $id
     * @return mixed
     */
    public function get($id) {
        return $this->getEvents()->get($id);
    }

    /**
     * Multiple entries by ids.
     *
     * @param string[]|int[] $ids
     * @return array
     */
    public function many(array $ids) {
        return $this->getEvents()->filter(function($event) use ($ids) {
            return in_array($event->id, $ids);
        })->values()->toArray();
    }

    /**
     * Attach a ApiHandler to this endpoint.
     *
     * @param \GW2Treasures\GW2Api\V2\ApiHandler $handler
     */
    public function attach(\GW2Treasures\GW2Api\V2\ApiHandler $handler) { }

    /**
     * The url of this endpoint.
     *
     * @return string
     */
    public function url() { return ''; }

    /**
     * All entries.
     *
     * @return array
     */
    function all() {
        return $this->getEvents()->values()->toArray();
    }

    /**
     * Get a single page.
     *
     * @param int $page
     * @param int $size
     * @return mixed
     */
    function page($page, $size = null) { }

    /**
     * Get all entries in multiple small batches to minimize memory usage.
     *
     * @param int|null $parallelRequests [optional]
     * @param callable $callback
     * @return void
     */
    function batch($parallelRequests = null, callable $callback) { }

    /**
     * Change the language of this endpoint.
     *
     * @param string $language
     * @return $this
     */
    public function lang($language) {
        $this->language = $language;
        return $this;
    }

    /**
     * Get the current language.
     *
     * @return string
     */
    public function getLang() {
        return $this->language;
    }

    public function schema($schema) {
        $this->schema = $schema;

        return $this->schema;
    }

    public function getSchema() {
        return $this->schema;
    }
}
