<?php

namespace NDM\Bundle\TryCatch\ApiBundle\Ingester\Resource;

use NDM\Bundle\TryCatch\ApiBundle\Ingester\Resource\Resource;

/**
 * File Resource
 *
 * Represents a concrete file resource
 *
 * @author David Mann <david.mann@newsdigitalmedia.com.au>
 * @package TryCatch
 * @subpackage Ingester
 */
class FileResource extends Resource {

	/**
	 * {@inheritdoc}
	 *
	 * @see NDM\Bundle\TryCatch\ApiBundle\Ingester\Resource.Resource::supports()
	 */
	public function supports($resource) {
		return file_exists($resource) === true && is_readable($resource) === true;
	}

	/**
	 * {@inheritdoc}
	 *
	 * @see NDM\Bundle\TryCatch\ApiBundle\Ingester\Resource.Resource::getContent()
	 */
	public function getContent() {
		return file_get_contents($this->resource);
	}

}