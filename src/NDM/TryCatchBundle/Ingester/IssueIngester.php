<?php
namespace NDM\TryCatchBundle\Ingester;

use NDM\TryCatchBundle\Entity\Issue;

use NDM\TryCatchBundle\Entity\Component;
use NDM\TryCatchBundle\Ingester;

class IssueIngester extends Ingester {

	protected function getExisting(array $record) {
		$entity = null;

		if(isset($record['id']) && $record['id']) {
			$entity = $this->om->getRepository('NDMTryCatchBundle:Issue')->findOneBy(array('uid' => $record['id']));
		}


		if(!$entity) {
			$entity = new Issue();
		}

		$this->om->persist($entity);

		return $entity;
	}

}