<?php
namespace NDM\TryCatchBundle\Ingester\Writer;
use NDM\TryCatchBundle\Ingester\Map\ColumnDefinition;

use Doctrine\Common\Collections\ArrayCollection;

use NDM\TryCatchBundle\Ingester\Writer\Writer;

/**
 * Map Writer
 *
 * The MapWriter is an implementation of a Writer which uses ColumnDefinitions
 * to describe how an object should be rewritten.
 *
 * @author David Mann <david.mann@newsdigitalmedia.com.au>
 * @package TryCatch
 * @subpackage Ingester
 */
class MapWriter implements Writer {

	private $map;

	/**
	 * @param array $map The transformation map
	 */
	public function __construct(array $map = array()) {
		array_walk($map, array($this, 'registerColumnDefinition'));
	}

	/**
	 * Register Column Definition
	 *
	 * Add a ColumnDefinition to the TransformationMap
	 *
	 * @param ColumnDefinition $def
	 * @return \NDM\TryCatchBundle\Ingester\Writer\MapWriter
	 */
	public function registerColumnDefinition(ColumnDefinition $def) {
		$this->map[] = $def;

		return $this;
	}

	/**
	 * {@inheritdoc}
	 *
	 * @see NDM\TryCatchBundle\Ingester\Writer.Writer::write()
	 */
	public function write(array $records) {
		$ret = new ArrayCollection();
		foreach($records as $i => $record) {
			$ret->set($i, $this->writeRecord($record[0], $record[1]));
		}

		return $ret;
	}

	/**
	 * Write Record
	 *
	 * Write a single record using the TransformationMap
	 *
	 * @param object $obj The object being written
	 * @param array $record The ingested data
	 * @return object The $obj
	 */
	protected function writeRecord($obj, array $record) {
		foreach($this->map as $mapDefinition) {
			if(!isset($record[$mapDefinition->getFrom()])) {
				$record[$mapDefinition->getFrom()] = null;
			}

			$value = $record[$mapDefinition->getFrom()];

			$this->writeColumn($obj, $mapDefinition, $record, $value);
		}

		return $obj;
	}

	/**
	 * Write a single Column
	 *
	 * @param object $obj The Entity being written to
	 * @param ColumnDefinition $to The transformation description
	 * @param array $record The ingested data
	 * @param  mixed $value The value to write
	 * @throws \InvalidArgumentException
	 */
	protected function writeColumn($obj, ColumnDefinition $to, array $record, $value) {
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