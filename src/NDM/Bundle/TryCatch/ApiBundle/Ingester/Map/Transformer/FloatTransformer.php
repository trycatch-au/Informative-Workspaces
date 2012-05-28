<?php
namespace NDM\Bundle\TryCatch\ApiBundle\Ingester\Map\Transformer;

use NDM\Bundle\TryCatch\ApiBundle\Ingester\Map\ColumnDefinition;

/**
 * Float Transformer
 *
 * Transforms data to a float
 *
 * @author David Mann <david.mann@newsdigitalmedia.com.au>
 * @package TryCatch
 * @subpackage Ingester
 */
class FloatTransformer {
	public function transform($value, $entity, array $record = array(), ColumnDefinition $to) {
		return (float) $value;
	}
}