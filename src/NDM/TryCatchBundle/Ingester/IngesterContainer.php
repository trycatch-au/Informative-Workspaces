<?php
namespace NDM\TryCatchBundle\Ingester;

use NDM\TryCatchBundle\Ingester\Resource\Resource;

use NDM\TryCatchBundle\Ingester\Reader\Reader;

use NDM\TryCatchBundle\Ingester\Writer\Writer;

use NDM\TryCatchBundle\Ingester;

class IngesterContainer {
	/**
	 * @var Ingester
	 */
	private $ingester;
	private $reader;
	private $writer;

	public function __construct(Ingester $ingester, Reader $reader, Writer $writer) {
		$this->ingester = $ingester;
		$this->reader = $reader;
		$this->writer = $writer;
	}

	public function ingest(Resource $resource) {
		return $this->ingester->ingest($resource, $this->reader, $this->writer);
	}
}