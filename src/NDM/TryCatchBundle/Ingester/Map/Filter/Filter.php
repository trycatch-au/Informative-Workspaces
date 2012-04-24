<?php
namespace NDM\TryCatchBundle\Ingester\Map\Filter;
use NDM\TryCatchBundle\Ingester\Map\ColumnDefinition;

/**
 * Contract for a Filter to implement
 *
 * A filter is a class which is capable of transforming / filtering the data
 * that is being remapped.
 *
 * Filters imply that the value must be of a certain format and when a filter
 * recieves an invalid value, it should return null.
 *
 * @author David Mann <david.mann@newsdigitalmedia.com.au>
 * @package TryCatch
 * @subpackage Ingester
 */
interface Filter {

	/**
	 * Filter the column data
	 *
	 * @param mixed $value The value to filter
	 * @param mixed $entity The database entity being ingested (May or may not exist in DB)
	 * @param array $record The raw reader record being ingested
	 * @param ColumnDefinition $to The column definition
	 */
	public function filter($value, $entity, array $record = array(), ColumnDefinition $to);
}