<?php
namespace NDM\TryCatchBundle\Ingester\Reader;

use NDM\TryCatchBundle\Ingester\Resource\Resource;

interface Reader {
	public function read(Resource $resource);
	public function supports(Resource $resource);
}