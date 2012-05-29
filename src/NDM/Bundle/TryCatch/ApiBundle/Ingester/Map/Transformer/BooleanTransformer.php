<?php
namespace NDM\Bundle\TryCatch\ApiBundle\Ingester\Map\Transformer;
use NDM\Bundle\TryCatch\ApiBundle\Ingester\Map\ColumnDefinition;

/**
 * Boolean Transformer
 *
 * Transforms data from any valid date format into a \BooleanTime object
 *
 * @author David Mann <david.mann@newsdigitalmedia.com.au>
 * @package TryCatch
 * @subpackage Ingester
 */
class BooleanTransformer {

	/**
	 * @param unknown_type $value
	 * @param unknown_type $entity
	 * @param array $record
	 * @param ColumnDefinition $to
	 * @return \BooleanTime|NULL
	 */
	public function transform($value, $entity, array $record = array(), ColumnDefinition $to) {
		if(!is_string($value)) {
			$value = strtolower($value);
			if(($value === 'yes') || ($value === 'y') || ($value === 't')) {
				$value = true;
			}else if(($value === 'no') || ($value === 'n') || ($value === 'f')) {
				$value = false;
			}
		}else{
			$value = (boolean) $value;
		}

		return $value;
	}
}