<?php
namespace NDM\Bundle\TryCatch\ApiBundle\Ingester;

use NDM\Bundle\TryCatch\ApiBundle\Entity\Issue;

use NDM\Bundle\TryCatch\ApiBundle\Entity\Component;
use NDM\Bundle\TryCatch\ApiBundle\Ingester;

class BuildIngester extends Ingester {

	protected function getExisting(array $record) {
		$entity = null;

		if(isset($record['component']) && $record['component']) {
			$entity = $this->om->getRepository('TryCatchApiBundle:Component')->findOneBy(array('name' => $record['component']));
		}


		if(!$entity) {
			$entity = new Issue();
		}

		$this->om->persist($entity);

		return $entity;
	}

}