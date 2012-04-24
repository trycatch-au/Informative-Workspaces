<?php

namespace NDM\TryCatchBundle;

use Doctrine\Common\Persistence\ObjectManager;

use NDM\TryCatchBundle\Ingester\Transformer\StringTransformer;
use NDM\TryCatchBundle\Ingester\Resource\Resource;
use NDM\TryCatchBundle\Ingester\Writer\Writer;
use NDM\TryCatchBundle\Ingester\Reader\Reader;

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
			if(count($this->om->getUnitOfWork()->size()) > 0) {
				$this->om->flush();
			}

			$records[$i] = array($entity, $record);
		}

		return $writer->write($records);
	}

	protected abstract function getExisting(array $record);
}