<?php
namespace NDM\TryCatchBundle\Ingester\Map\Transformer;

use NDM\TryCatchBundle\Ingester\Map\ColumnDefinition;

/**
 * Integer Transformer
 *
 * Transforms data to an integer
 *
 * @author David Mann <david.mann@newsdigitalmedia.com.au>
 * @package TryCatch
 * @subpackage Ingester
 */
class IntegerTransformer {
	public function transform($value, $entity, array $record = array(), ColumnDefinition $to) {
		return intval($value);
	}
}