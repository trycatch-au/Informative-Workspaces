<?php
namespace NDM\Bundle\TryCatch\ApiBundle\Ingester\Map\Transformer;
use NDM\Bundle\TryCatch\ApiBundle\Ingester\Map\ColumnDefinition;

/**
 * Date Transformer
 *
 * Transforms data from any valid date format into a \DateTime object
 *
 * @author David Mann <david.mann@newsdigitalmedia.com.au>
 * @package TryCatch
 * @subpackage Ingester
 */
class DateTransformer {

	/**
	 * @param unknown_type $value
	 * @param unknown_type $entity
	 * @param array $record
	 * @param ColumnDefinition $to
	 * @return \DateTime|NULL
	 */
	public function transform($value, $entity, array $record = array(), ColumnDefinition $to) {
        if($value === null || $value === 'null' || $value === '') {
            return null;
        }
        if($value === 'now') {
            return new \DateTime();
        }

		try {
			$date = new \DateTime($value);

			return $date;
		}catch(\Exception $e) {
			$date = strtotime($value);
			if(empty($date)) {
				return null;
			}

			return new \DateTime('@' . $date);
		}
	}
}
