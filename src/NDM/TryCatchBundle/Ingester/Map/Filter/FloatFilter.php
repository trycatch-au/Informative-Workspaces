<?php
namespace NDM\TryCatchBundle\Ingester\Map\Filter;

use NDM\TryCatchBundle\Ingester\Map\ColumnDefinition;

/**
 * Float Filter
 *
 * Transforms data to a float
 *
 * @author David Mann <david.mann@newsdigitalmedia.com.au>
 * @package TryCatch
 * @subpackage Ingester
 */
class FloatFilter {
	public function filter($value, $entity, array $record = array(), ColumnDefinition $to) {
		return (float) $value;
	}
}