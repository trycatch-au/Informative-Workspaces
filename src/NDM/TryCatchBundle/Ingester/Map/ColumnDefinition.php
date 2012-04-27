<?php
namespace NDM\TryCatchBundle\Ingester\Map;
use NDM\TryCatchBundle\Ingester\Map\Transformer\Transformer;

use NDM\TryCatchBundle\Ingester\Map\Transformer\TextCleanerTransformer;

/**
 * Column Definition
 *
 * Represents a column transformation/remap rule.
 *
 * For example, we may have a data source that has the column "id" which we want to
 * populate in the "uuid" column of our internal data structure.
 * E.G
 * array(array('id' => '1'))
 *
 * To do this, we would create a ColumnDefinition which specifies that the data should
 * come FROM "id" and be remapped to "uuid". So after running our filter, our data now looks like
 * array(array('uuid'=> '1')).
 *
 * We can also specify filters which are small functions that are able to filter/transform the data
 * that we are remapping. For example, we know that the ID is always an integer but readers converts
 * all types to strings so if we tried to pass the ID to a method which only accepted ints, it would not work.
 *
 * To solve this, we could register a new Integer filter.
 * $columnDef->registerFilter(new \NDM\TryCatchBundle\Ingester\Filter\IntegerFilter());
 *
 * which would result in
 * array(array('id' => '1'))
 * being converted to
 * array(array('uuid' => 1))
 *
 * @author David Mann <david.mann@newsdigitalmedia.com.au>
 * @package TryCatch
 * @subpackage Ingester
 */
class ColumnDefinition {

	/**
	 * @var scalar The column to retrieve data from
	 */
	private $from;
	/**
	 * @var scalar The column to remap the data too
	 */
	private $to;
	/**
	 * @var array An array of filters to apply to values being remapped
	 */
	private $filters = array();

	/**
	 * @param scalar $to The column to remap the data to
	 * @param scalar $from The column to retrieve the data from
	 * @param array $filters An array of filters to apply to all values being remapped
	 */
	public function __construct($from, $to, array $filters = array()) {
		if($to === null) {
			$to = $from;
		}

		if(count($filters) === 0) {
			$filters = array(new TextCleanerTransformer());
		}


		$this->setFrom($from);
		$this->setTo($to);
		$this->setFilters($filters);
	}

	/**
	 * @return scalar
	 */
	public function getFrom() {
		return $this->from;
	}

	/**
	 * @param scalar $from The from column
	 */
	public function setFrom($from) {
		$this->from = $from;
	}

	/**
	 * @return scalar The column to map the data too
	 */
	public function getTo() {
		return $this->to;
	}

	/**
	 * @param scalar $to The column to remap data too
	 */
	public function setTo($to) {
		$this->to = $to;
	}

	/**
	 * @return array The filters being appled to this definition
	 */
	public function getFilters() {
		return $this->filters;
	}

	/**
	 * @param array $filters The filters to apply to this definition
	 */
	public function setFilters(array $filters) {
		$this->filters = $filters;
	}

	/**
	 * Register a new Filter
	 *
	 * @param Filter $filter The filter to register
	 * @return \NDM\TryCatchBundle\Ingester\Map\ColumnDefinition
	 */
	public function addFilter(Filter $filter) {
		if(!in_array($filter, $this->filters)) {
			$this->filters[] = $filter;
		}

		return $this;
	}
}
