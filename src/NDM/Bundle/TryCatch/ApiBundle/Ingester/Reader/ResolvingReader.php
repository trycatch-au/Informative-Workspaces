<?php
namespace NDM\Bundle\TryCatch\ApiBundle\Ingester\Reader;
use NDM\Bundle\TryCatch\ApiBundle\Ingester\Resource\Resource;

class ResolvingReader implements Reader{

	private $readers;

	public function __construct(array $readers = array()) {
		$this->readers = array();
		array_map(array($this, 'registerReader'), $readers);
	}

	public function registerReader(Reader $reader) {
		$this->readers[] = $reader;
	}

	public function supports(Resource $resource) {
		$reader = $this->getReaderForResource($resource);
		return $reader instanceof Reader;
	}

	public function read(Resource $resource) {
		$reader = $this->getReaderForResource($resource);
		if(!$reader) {
			throw new \InvalidArgumentException('Unable to get reader for resource');
		}

		return $reader->read($resource);
	}

	protected function getReaderForResource(Resource $resource) {
		foreach($this->readers as $reader) {
			if ($reader->supports($resource)) {
				return $reader;
			}
		}
	}

}