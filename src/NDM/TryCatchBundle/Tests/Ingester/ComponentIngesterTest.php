<?php
namespace NDM\TryCatchBundle\Tests\Ingester;

use NDM\TryCatchBundle\Ingester\ComponentIngester;

use NDM\TryCatchBundle\Entity\Component;

use NDM\TryCatchBundle\Tests\IngesterTest;

class ComponentIngesterTest extends IngesterTest {

	protected function getIngester($mock) {
		return new ComponentIngester($mock);
	}

	protected function getEntityAlias() {
		return 'NDMTryCatchBundle:Component';
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