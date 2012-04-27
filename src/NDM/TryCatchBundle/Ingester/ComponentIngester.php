<?php
namespace NDM\TryCatchBundle\Ingester;

use NDM\TryCatchBundle\Entity\Component;
use NDM\TryCatchBundle\Ingester;

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
		$entity = $this->om->getRepository('NDMTryCatchBundle:Component')->findOneBy(array('name' => $record['name']));

		if(!$entity) {
			$entity = new Component();
			$entity->setName($record['name']);
			$entity->setVersion(isset($record['version']) ? $record['version'] : 'unknown');
			$this->om->persist($entity);
		}

		return $entity;
	}

}