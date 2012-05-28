<?php
namespace NDM\Bundle\TryCatch\ApiBundle\Tests;
use NDM\Bundle\TryCatch\ApiBundle\Ingester\ComponentIngester;

abstract class IngesterTest extends \PHPUnit_Framework_Testcase {

	/**
	 */
	public function testGetExisting() {
		$mock = $this->getMock('Doctrine\\ORM\\EntityManager', array(), array(), '', false);
		$resource = $this->getMock('NDM\\Bundle\\TryCatch\\ApiBundle\\Ingester\\Resource\\Resource', array(), array(), '', false);
		$readerMock = $this->getMock('NDM\\Bundle\\TryCatch\\ApiBundle\\Ingester\\Reader\\Reader');
		$readerMock->expects($this->exactly(1))
			->method('read')
			->with($resource)
			->will($this->returnValue(array(array('id' => 1, 'name' => 'foo'))))
		;

		$mock
			->expects($this->exactly(1))
			->method('getRepository')
			->with($this->getEntityAlias())
			->will($this->returnValue($this->getRepository()))
		;
		$ingester = $this->getIngester($mock);
		;
		$ingester->ingest($resource, $readerMock, $this->getMock('NDM\\Bundle\\TryCatch\\ApiBundle\\Ingester\\Writer\\Writer'));
	}

	/**
	 */
	public function testNotExisting() {
		$mock = $this->getMock('Doctrine\\ORM\\EntityManager', array(), array(), '', false);
		$resource = $this->getMock('NDM\\Bundle\\TryCatch\\ApiBundle\\Ingester\\Resource\\Resource', array(), array(), '', false);
		$readerMock = $this->getMock('NDM\\Bundle\\TryCatch\\ApiBundle\\Ingester\\Reader\\Reader');
		$readerMock->expects($this->exactly(1))
			->method('read')
			->with($resource)
			->will($this->returnValue(array(array('id' => 1, 'name' => 'foo'))))
		;

		$mock
			->expects($this->exactly(1))
			->method('getRepository')
			->with($this->getEntityAlias())
			->will($this->returnValue($this->getEmptyRepository()))
		;
		$ingester = $this->getIngester($mock);
		;
		$ingester->ingest($resource, $readerMock, $this->getMock('NDM\\Bundle\\TryCatch\\ApiBundle\\Ingester\\Writer\\Writer'));
	}

	abstract protected function getIngester($mock);

	abstract protected function getEntityAlias();

	abstract protected function getEmptyRepository();

	abstract protected function getRepository();
}