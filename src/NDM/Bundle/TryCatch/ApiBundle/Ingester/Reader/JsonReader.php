<?php
namespace NDM\Bundle\TryCatch\ApiBundle\Ingester\Reader;
use NDM\Bundle\TryCatch\ApiBundle\Ingester\Resource\Resource;


/**
 * Json Reader
 *
 * Removes unnecessary whitespace from a string
 *
 * @author David Mann <david.mann@newsdigitalmedia.com.au>
 * @package TryCatch
 * @subpackage Ingester
 */
class JsonReader implements Reader{

	/**
	 * {@inheritdoc}
	 *
	 * @see NDM\Bundle\TryCatch\ApiBundle\Ingester\Reader.Reader::read()
	 */
	public function read(Resource $resource) {
		$items = json_decode($resource->getContent(), true);

		return $items;
	}

	/**
	 * {@inheritdoc}
	 *
	 * @see NDM\Bundle\TryCatch\ApiBundle\Ingester\Reader.Reader::supports()
	 */
	public function supports(Resource $resource) {
		$content = trim($resource->getContent());
		$firstChar = substr($content, 0, 1);
		$lastChar = substr($content, strlen($content) - 1, 1);

		return (($firstChar === '[' && $lastChar === ']') || ($firstChar === '{' && $lastChar === '}')) && is_array($this->read($resource));
	}

}