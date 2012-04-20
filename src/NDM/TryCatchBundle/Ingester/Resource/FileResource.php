<?php

namespace NDM\TryCatchBundle\Ingester\Resource;

use NDM\TryCatchBundle\Ingester\Resource\Resource;

class FileResource extends Resource {

	public function supports($resource) {
		return file_exists($resource) === true && is_readable($resource) === true;
	}

	public function getContent() {
		return file_get_contents($this->resource);
	}

}