<?php
namespace NDM\TryCatchBundle\Ingester\Map\Transformer;

use NDM\TryCatchBundle\Ingester\Map\ColumnDefinition;
use Doctrine\Common\Collections\ArrayCollection;


/**
 * Collection Transformer
 *
 * Transforms data from
 * 'foo|bar' into array('foo', 'bar');
 *
 * @author David Mann <david.mann@newsdigitalmedia.com.au>
 * @package TryCatch
 * @subpackage Ingester
 */
class CollectionTransformer implements Transformer {
	const REGEX_SPLIT = '#(?<!\\\)\\|#';
	public function transform($value, $entity, array $record = array(), ColumnDefinition $to) {
		if(!is_string($value)) {
			return $value;
		}

		if(!strpos($value, '|')) {
			return array($value);
		}

		$data = preg_split(self::REGEX_SPLIT, $value);

		array_walk($data, function(&$value, $key = null) { // Remove any escape chars
			$value = str_replace('\|', '|', $value);

			return $value;
		});

		return $data;
	}
}