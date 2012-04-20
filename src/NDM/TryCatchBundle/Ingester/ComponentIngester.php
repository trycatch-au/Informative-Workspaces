<?php
namespace NDM\TryCatchBundle\Ingester;

use NDM\TryCatchBundle\Entity\Component;
use NDM\TryCatchBundle\Ingester;

class ComponentIngester extends Ingester {

	protected function getExisting(array $record) {
		$entity = $this->om->getRepository('NDMTryCatchBundle:Component')->findOneBy(array('name' => $record['name']));

		if(!$entity) {
			$entity = new Component();
			$this->om->persist($entity);
		}

		return $entity;
	}

}