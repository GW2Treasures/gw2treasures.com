<?php

class GW2Api {
	/** @var string URL of the gw2api */
	private $_url = 'https://api.guildwars2.com/v2/';

	/** @var array Supported languages */
	private $_languages = array(
		'de',
		'en',
		'es',
		'fr',
	    // 'ko',
	    // 'zh',
	);


	public function __construct() {
	}

	/**
	 * Setups a new RollingCurl Instance
	 * @return \RollingCurl\RollingCurl
	 */
	private function setupCurl() {
		$curl = new \RollingCurl\RollingCurl();
		$curl->addOptions( array(
			CURLOPT_CAINFO => __DIR__ . DIRECTORY_SEPARATOR . 'cacert.pem',
			CURLOPT_HEADER => true,
		    CURLOPT_USERAGENT => 'GW2Treasures Bot/1.0 (+https://gw2treasures.com/contact)'
		));
		return $curl;
	}

	/**
	 * @param \RollingCurl\Request $request
	 * @return array
	 */
	private function parseCurlResponse( $request ) {
		$info = $request->getResponseInfo();
		$text = $request->getResponseText();
		$header_size = $info['header_size'];

		$headerRaw = trim( substr( $text, 0, $header_size ));
		$headers = array();

		foreach( explode( "\n", $headerRaw ) as $i => $line ) {
			if( $i === 0 ) {
				$headers['http_code'] = trim($line);
			} else {
				list( $key, $value ) = explode( ': ', $line, 2 );
				$headers[ trim( $key ) ] = trim( $value );
			}
		}

		return array(
			'headers' => $headers,
			'body' => substr( $text, $header_size ),
		);
	}

	public function getItemIds() {
		$curl = $this->setupCurl();
		$curl->get( $this->_url . 'items' );

		$ids = array();

		$_this = $this;
		$curl->setCallback( function( \RollingCurl\Request $request, \RollingCurl\RollingCurl $rollingCurl ) use ( $_this, &$ids ) {
			$response = $_this->parseCurlResponse( $request );
			$ids = json_decode( $response[ 'body' ] );
		});

		$curl->execute();

		return $ids;
	}

	/**
	 * Loads a single item from the api.
	 * @param $id
	 * @return array
	 */
	public function getItem( $id ) {
		$curl = $this->setupCurl();
		$result = array();

		foreach( $this->_languages as $lang ) {
			$curl->get( $this->_url . 'items/' . $id . '?lang=' . $lang );
		}

		$_this = $this;
		$curl->setCallback( function( \RollingCurl\Request $request, \RollingCurl\RollingCurl $rollingCurl ) use ( $_this, &$result ) {
			$response = $_this->parseCurlResponse( $request );

			$lang = $response['headers']['Content-Language'];

			$result[ $lang ] = json_decode( $response['body'] );
		});

		$curl->execute();

		return $result;
	}

	/**
	 * Loads multiple items from the api.
	 * @param array $ids
	 * @return array
	 */
	public function getItems( $ids = array() ) {
		$chunks = array_chunk( $ids, 200, false );
		$curl = $this->setupCurl();

		$result = array();

		foreach( $chunks as $chunk ) {
			foreach( $this->_languages as $lang ) {
				$curl->get( $this->_url . 'items/?ids=' . implode( ',', $chunk ) . '&lang=' . $lang );
			}
			foreach( $chunk as $id ) {
				$result[ $id ] = null;
			}
		}

		$_this = $this;
		$curl->setCallback( function( \RollingCurl\Request $request, \RollingCurl\RollingCurl $rollingCurl ) use ( $_this, &$result ) {
			$response = $_this->parseCurlResponse( $request );

			$lang = $response['headers']['Content-Language'];

			$items = json_decode( $response['body'] );
			foreach( $items as $item ) {
				if( $result[ $item->id ] === null ) {
					$result[ $item->id ] = array();
				}
				$result[ $item->id ][ $lang ] = $item;
			}
		});

		$curl->execute();

		return $result;
	}

	/**
	 * Loads multiple items from the api.
	 * @param array    $ids
	 * @param callable $callback
	 */
	public function getItemsBatch( $ids = array(), callable $callback ) {
		$id_chunks = array_chunk( $ids, 200, false );
		$curl = $this->setupCurl();
		$curl->setSimultaneousLimit( 20 );

		$chunks = array();
		$urls = array();

		foreach( $id_chunks as $i => $ids ) {
			$chunks[ $i ] = array(
			//	'ids' => $ids,
			    'languagesLoaded' => 0,
			    'items' => array()
			);

			foreach( $this->_languages as $lang ) {
				$url = $this->_url . 'items/?ids=' . implode( ',', $ids ) . '&lang=' . $lang;
				$urls[ $url ] = $i;
				$curl->get( $url );
			}
		}

		$_this = $this;
		$curl->setCallback( function( \RollingCurl\Request $request, \RollingCurl\RollingCurl $rollingCurl ) use ( $_this, &$chunks, $urls, $callback ) {
			$response = $_this->parseCurlResponse( $request );

			$lang = $response['headers']['Content-Language'];
			$url = $request->getUrl();

			$chunk = &$chunks[ $urls[ $url ]];

			$items = json_decode( $response['body'] );
			foreach( $items as $item ) {
				if( !array_key_exists( $item->id, $chunk[ 'items' ] )) {
					$chunk[ 'items' ][ $item->id ] = array();
				}
				$chunk[ 'items' ][ $item->id ][ $lang ] = $item;
			}

			$chunk['languagesLoaded']++;

			if( $chunk['languagesLoaded'] === count( $_this->_languages )) {
				$callback( $chunk['items'] );
				$chunk['items'] = null;
				$rollingCurl->clearCompleted();
			}
		});

		$curl->execute();
	}
}
