<?php
namespace NDM\TryCatchBundle\Ingester\Map\Filter;

/**
 * Text Cleaner Filter
 *
 * Removes unnecessary whitespace from a string
 *
 * @author David Mann <david.mann@newsdigitalmedia.com.au>
 * @package TryCatch
 * @subpackage Ingester
 */
class TextCleanerFilter extends StringFilter {

	public function filter($value) {
		return trim(preg_replace('/[ ]{1,}/', ' ', parent::filter($value)));
	}
}