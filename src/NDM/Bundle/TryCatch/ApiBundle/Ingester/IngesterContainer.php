<?php
namespace NDM\Bundle\TryCatch\ApiBundle\Ingester;

use Doctrine\Common\Collections\ArrayCollection;

use NDM\Bundle\TryCatch\ApiBundle\Ingester\Resource\Resource;

use NDM\Bundle\TryCatch\ApiBundle\Ingester\Reader\Reader;

use NDM\Bundle\TryCatch\ApiBundle\Ingester\Writer\Writer;

use NDM\Bundle\TryCatch\ApiBundle\Ingester;

/**
 * IngesterContainer
 *
 * The IngesterContainer is a container of a Ingester which was created by
 * the service container and allows for pre-setup ingestments which are
 * pre-configured and (generally) retrieved from the service container
 *
 * @author David Mann <david.mann@newsdigitalmedia.com.au>
 * @package TryCatch
 * @subpackage Ingester
 */
class IngesterContainer {
	/**
	 * @var Ingester
	 */
	private $ingester;
	private $reader;
	private $writer;

	/**
	 * @param Ingester $ingester The Ingester
	 * @param Reader $reader The Reader (Usually a ResolvingReader)
	 * @param Writer $writer The Writer
	 */
	public function __construct(Ingester $ingester, Reader $reader, Writer $writer) {
		$this->ingester = $ingester;
		$this->reader = $reader;
		$this->writer = $writer;
	}

	/**
	 * Ingest a resource
	 *
	 * @param Resource $resource The resource to ingest
	 * @return ArrayCollection
	 */
	public function ingest(Resource $resource) {
		return $this->ingester->ingest($resource, $this->reader, $this->writer);
	}
}