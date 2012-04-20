<?php
namespace NDM\TryCatchBundle\Ingester\Resource;
class StringResource extends Resource {

	public function supports($resource) {
		return true;
	}

	public function getContent() {
		return $this->resource;
	}
}