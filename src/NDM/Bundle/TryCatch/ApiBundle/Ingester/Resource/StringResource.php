<?php
namespace NDM\Bundle\TryCatch\ApiBundle\Ingester\Resource;

/**
 * String Resource
 *
 * Represents a single string resource
 *
 * @author David Mann <david.mann@newsdigitalmedia.com.au>
 * @package TryCatch
 * @subpackage Ingester
 */
class StringResource extends Resource {

	/**
	 * {@inheritdoc}
	 *
	 * @see NDM\Bundle\TryCatch\ApiBundle\Ingester\Resource.Resource::supports()
	 */
	public function supports($resource) {
		return true;
	}

	/**
	 * {@inheritdoc}
	 *
	 * @see NDM\Bundle\TryCatch\ApiBundle\Ingester\Resource.Resource::getContent()
	 */
	public function getContent() {
		return $this->resource;
	}
}