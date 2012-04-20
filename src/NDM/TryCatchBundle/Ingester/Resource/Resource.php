<?php
namespace NDM\TryCatchBundle\Ingester\Resource;
abstract class Resource {

	protected $resource;

	private $tmpFile;

	public function __construct($resource) {
		if(!$this->supports($resource)) {
			throw new \InvalidArgumentException(sprintf('The resource "%s" is not supported by the "%s" resource class.', $resource, get_called_class()));
		}

		$this->resource = $resource;
	}

	public abstract function supports($resource);

	public abstract function getContent();

	public function getTmpFile() {
		if(!$this->tmpFile) {
			$path = sys_get_temp_dir().'/' . uniqid(__CLASS__);
			file_put_contents($path, $this->getContent());

			$this->tmpFile = $path;
		}

		return $this->tmpFile;
	}

}