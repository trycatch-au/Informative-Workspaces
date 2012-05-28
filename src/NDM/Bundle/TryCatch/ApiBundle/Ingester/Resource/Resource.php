<?php
namespace NDM\Bundle\TryCatch\ApiBundle\Ingester\Resource;

/**
 * @author davidmann
 *
 */
abstract class Resource {
	protected $resource;

	private $tmpFile;

	/**
	 * @param unknown_type $resource The resource that is supported by this Resource
	 * @throws \InvalidArgumentException Thrown when this resource does not support $resource
	 */
	public function __construct($resource) {
		if(!$this->supports($resource)) {
			throw new \InvalidArgumentException(sprintf('The resource "%s" is not supported by the "%s" resource class.', $resource, get_called_class()));
		}

		$this->resource = $resource;
	}

	/**
	 * @return string
	 */
	public function getTmpFile() {
		if(!$this->tmpFile) {
			$path = sys_get_temp_dir().'/' . uniqid(__CLASS__);
			file_put_contents($path, $this->getContent());

			$this->tmpFile = $path;
		}

		return $this->tmpFile;
	}

	/**
	 * @param mixed $resource
	 * @return boolean
	 */
	public abstract function supports($resource);

	/**
	 * @return string
	 */
	public abstract function getContent();
}