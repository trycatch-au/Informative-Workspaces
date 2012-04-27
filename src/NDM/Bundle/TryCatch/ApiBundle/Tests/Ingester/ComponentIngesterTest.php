<?php
namespace NDM\Bundle\TryCatch\ApiBundle\Tests\Ingester;

use NDM\Bundle\TryCatch\ApiBundle\Ingester\ComponentIngester;

use NDM\Bundle\TryCatch\ApiBundle\Entity\Component;

use NDM\Bundle\TryCatch\ApiBundle\Tests\IngesterTest;

class ComponentIngesterTest extends IngesterTest {

	protected function getIngester($mock) {
		return new ComponentIngester($mock);
	}

	protected function getEntityAlias() {
		return 'TryCatchApiBundle:Component';
	}

	protected function getRepository() {
		$mock = $this->getMock('Doctrine\\ORM\\EntityRepository', array(), array(), '', false);
		$mock->expects($this->exactly(1))
			->method('findOneBy')
			->with(array('name' => 'foo'))
			->will($this->returnValue(new Component()))
		;

		return $mock;
	}

	protected function getEmptyRepository() {
		$mock = $this->getMock('Doctrine\\ORM\\EntityRepository', array(), array(), '', false);
		$mock->expects($this->exactly(1))
			->method('findOneBy')
			->with(array('name' => 'foo'))
			->will($this->returnValue(false))
		;

		return $mock;
	}
}