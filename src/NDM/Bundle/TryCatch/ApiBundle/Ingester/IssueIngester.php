<?php
namespace NDM\Bundle\TryCatch\ApiBundle\Ingester;

use NDM\Bundle\TryCatch\ApiBundle\Entity\Issue;

use NDM\Bundle\TryCatch\ApiBundle\Entity\Component;
use NDM\Bundle\TryCatch\ApiBundle\Ingester;

class IssueIngester extends Ingester {

	protected function getExisting(array $record) {
		$entity = null;

		if(isset($record['id']) && $record['id']) {
			$entity = $this->om->getRepository('TryCatchApiBundle:Issue')->findOneBy(array('uid' => $record['id']));
		}


		if(!$entity) {
			$entity = new Issue();
		}

		$this->om->persist($entity);

		return $entity;
	}

}