<?php
namespace NDM\Bundle\TryCatch\ApiBundle\Ingester;

use NDM\Bundle\TryCatch\ApiBundle\Entity\Channel;

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
class InstanceIngester extends Ingester {

	protected function getExisting(array $record) {
		$entity = $this->om->getRepository('TryCatchApiBundle:Channel')->findOneBy(array('name' => $record['name']));

		if(!$entity) {
			$entity = new Channel();
			$entity->setName($record['name']);
			$this->om->persist($entity);
		}

		return $entity;
	}

}