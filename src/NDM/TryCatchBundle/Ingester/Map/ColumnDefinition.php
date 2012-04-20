<?php
namespace NDM\TryCatchBundle\Ingester\Map;
use NDM\TryCatchBundle\Ingester\Map\Filter\TextCleanerFilter;

class ColumnDefinition {

	private $from;
	private $to;
	private $filters = array();

	public function __construct($from, $to, array $filters = array()) {
		if($to === null) {
			$to = $from;
		}

		if(count($filters) === 0) {
			$filters = array(new TextCleanerFilter());
		}


		$this->setFrom($from);
		$this->setTo($to);
		$this->setFilters($filters);
	}

	public function getFrom() {
		return $this->from;
	}

	public function setFrom($from) {
		$this->from = $from;
	}

	public function getTo() {
		return $this->to;
	}

	public function setTo($to) {
		$this->to = $to;
	}

	public function getFilters() {
		return $this->filters;
	}

	public function setFilters(array $filters) {
		$this->filters = $filters;
	}
}
