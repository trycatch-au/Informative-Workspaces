<?php
namespace NDM\TryCatchBundle\Ingester\Map\Filter;

use NDM\TryCatchBundle\Ingester\Map\ColumnDefinition;

/**
 * Integer Filter
 *
 * Transforms data to an integer
 *
 * @author David Mann <david.mann@newsdigitalmedia.com.au>
 * @package TryCatch
 * @subpackage Ingester
 */
class IntegerFilter {
	public function filter($value, $entity, array $record = array(), ColumnDefinition $to) {
		return intval($value);
	}
}