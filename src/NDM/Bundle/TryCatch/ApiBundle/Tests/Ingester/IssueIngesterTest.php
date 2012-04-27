<?php
namespace NDM\Bundle\TryCatch\ApiBundle\Tests\Ingester;

use NDM\Bundle\TryCatch\ApiBundle\Ingester\IssueIngester;

use NDM\Bundle\TryCatch\ApiBundle\Entity\Issue;

use NDM\Bundle\TryCatch\ApiBundle\Tests\IngesterTest;

class IssueIngesterTest extends IngesterTest {

	protected function getIngester($mock) {
		return new IssueIngester($mock);
	}

	protected function getEntityAlias() {
		return 'TryCatchApiBundle:Issue';
	}

	protected function getRepository() {
		$mock = $this->getMock('Doctrine\\ORM\\EntityRepository', array(), array(), '', false);
		$mock->expects($this->exactly(1))
			->method('findOneBy')
			->with(array('uid' => 1))
			->will($this->returnValue(new Issue()))
		;

		return $mock;
	}

	protected function getEmptyRepository() {
		$mock = $this->getMock('Doctrine\\ORM\\EntityRepository', array(), array(), '', false);
		$mock->expects($this->exactly(1))
			->method('findOneBy')
			->with(array('uid' => 1))
			->will($this->returnValue(false))
		;

		return $mock;
	}
}