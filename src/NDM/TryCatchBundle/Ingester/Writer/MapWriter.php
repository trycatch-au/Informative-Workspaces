<?php
namespace NDM\TryCatchBundle\Ingester\Writer;
use NDM\TryCatchBundle\Ingester\Map\ColumnDefinition;

use Doctrine\Common\Collections\ArrayCollection;

use NDM\TryCatchBundle\Ingester\Writer\Writer;

class MapWriter implements Writer {

	private $map;

	public function __construct(array $map = array()) {
		$this->map = $map;
	}

	public function registerColumnDefinition(ColumnDefinition $def) {
		$this->map[] = $def;

		return $this;
	}

	public function write(array $records) {
		$ret = new ArrayCollection();
		foreach($records as $i => $record) {
			$ret->set($i, $this->writeRecord($record[0], $record[1]));
		}

		return $ret;
	}

	protected function writeRecord($obj, $record) {
		foreach($this->map as $mapDefinition) {
			if(!isset($record[$mapDefinition->getFrom()])) {
				$record[$mapDefinition->getFrom()] = null;
			}

			$value = $record[$mapDefinition->getFrom()];

			$this->writeColumn($obj, $mapDefinition, $record, $value);
		}

		return $obj;
	}

	protected function writeColumn($obj, ColumnDefinition $to, $record, $value) {
		$setter = sprintf('set%s', ucfirst($to->getTo()));
		if(!is_callable(array($obj, $setter))) {
			throw new \InvalidArgumentException(sprintf('Cannot map column "%s" as the setter "%s::%s" does not exist.', $to->getTo(), get_class($obj), $setter));
		}

		foreach($to->getFilters() as $filter) {
			$value = $filter->filter($value, $obj, $record, $to);
		}

		$obj->$setter($value);
	}
}