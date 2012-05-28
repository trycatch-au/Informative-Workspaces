<?php
namespace NDM\Bundle\TryCatch\ApiBundle\Ingester\Map\Transformer;

/**
 * Text Cleaner Transformer
 *
 * Removes unnecessary whitespace from a string
 *
 * @author David Mann <david.mann@newsdigitalmedia.com.au>
 * @package TryCatch
 * @subpackage Ingester
 */
class TextCleanerTransformer extends StringTransformer {

	public function transform($value) {
		return trim(preg_replace('/[ ]{1,}/', ' ', parent::transform($value)));
	}
}