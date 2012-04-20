<?php
namespace NDM\TryCatchBundle\Ingester\Reader;
use NDM\TryCatchBundle\Ingester\Resource\Resource;

class ResolvingReader implements Reader{

	private $readers;

	public function __construct(array $readers = array()) {
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