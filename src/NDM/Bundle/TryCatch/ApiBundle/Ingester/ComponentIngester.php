<?php
namespace NDM\Bundle\TryCatch\ApiBundle\Ingester;

use NDM\Bundle\TryCatch\ApiBundle\Entity\Component;
use NDM\Bundle\TryCatch\ApiBundle\Ingester;

/**
 * ComponentIngester
 *
 * The ComponentIngester is an implementation of an ingester which
 * does a lookup of current components prior to importation
 *
 * @author David Mann <david.mann@newsdigitalmedia.com.au>
 * @package TryCatch
 * @subpackage Ingester
 */
class ComponentIngester extends Ingester {

	protected function getExisting(array $record) {
		$entity = $this->om->getRepository('TryCatchApiBundle:Component')->findOneBy(array('name' => $record['name']));

		if(!$entity) {
			$entity = new Component();
			$entity->setName($record['name']);
			$entity->setVersion(isset($record['version']) ? $record['version'] : 'unknown');
			$this->om->persist($entity);
		}

		return $entity;
	}

}