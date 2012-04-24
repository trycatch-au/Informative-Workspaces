<?php
namespace NDM\TryCatchBundle\Tests\Ingester;

use NDM\TryCatchBundle\Ingester\IssueIngester;

use NDM\TryCatchBundle\Entity\Issue;

use NDM\TryCatchBundle\Tests\IngesterTest;

class IssueIngesterTest extends IngesterTest {

	protected function getIngester($mock) {
		return new IssueIngester($mock);
	}

	protected function getEntityAlias() {
		return 'NDMTryCatchBundle:Issue';
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