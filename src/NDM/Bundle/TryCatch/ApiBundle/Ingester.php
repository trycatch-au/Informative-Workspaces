<?php

namespace NDM\Bundle\TryCatch\ApiBundle;

use Doctrine\Common\Persistence\ObjectManager;

use NDM\Bundle\TryCatch\ApiBundle\Ingester\Transformer\StringTransformer;
use NDM\Bundle\TryCatch\ApiBundle\Ingester\Resource\Resource;
use NDM\Bundle\TryCatch\ApiBundle\Ingester\Writer\Writer;
use NDM\Bundle\TryCatch\ApiBundle\Ingester\Reader\Reader;

abstract class Ingester {

	protected $om;

	private $preTransformers = array();

	private $reader;

	public function __construct(ObjectManager $om) {
		$this->om = $om;
	}

	public function ingest(Resource $resource, Reader $reader, Writer $writer) {
		$records = $reader->read($resource);

		foreach($records as $i => $record) {
			$entity = $this->getExisting($record);

			$records[$i] = array($entity, $record);
		}

		return $writer->write($records);
	}

	protected abstract function getExisting(array $record);
}