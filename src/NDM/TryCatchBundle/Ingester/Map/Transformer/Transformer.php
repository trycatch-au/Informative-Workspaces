<?php
namespace NDM\TryCatchBundle\Ingester\Map\Transformer;
use NDM\TryCatchBundle\Ingester\Map\ColumnDefinition;

/**
 * Contract for a Transformer to implement
 *
 * A Transformer is a class which is capable of transforming / Transformering the data
 * that is being remapped.
 *
 * Transformers imply that the value must be of a certain format and when a Transformer
 * recieves an invalid value, it should return null.
 *
 * @author David Mann <david.mann@newsdigitalmedia.com.au>
 * @package TryCatch
 * @subpackage Ingester
 */
interface Transformer {

	/**
	 * Transformer the column data
	 *
	 * @param mixed $value The value to Transformer
	 * @param mixed $entity The database entity being ingested (May or may not exist in DB)
	 * @param array $record The raw reader record being ingested
	 * @param ColumnDefinition $to The column definition
	 */
	public function transform($value, $entity, array $record = array(), ColumnDefinition $to);
}