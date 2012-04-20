<?php
namespace NDM\TryCatchBundle\Ingester\Reader;
use NDM\TryCatchBundle\Ingester\Resource\Resource;

class JsonReader implements Reader{

	public function read(Resource $resource) {
		$items = json_decode($resource->getContent(), true);

		return $items;
	}

	public function supports(Resource $resource) {
		$content = trim($resource->getContent());
		$firstChar = substr($content, 0, 1);
		$lastChar = substr($content, strlen($content) - 1, 1);

		return (($firstChar === '[' && $lastChar === ']') || ($firstChar === '{' && $lastChar === '}')) && is_array($this->read($resource));
	}

}