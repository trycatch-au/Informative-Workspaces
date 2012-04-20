<?php
namespace NDM\TryCatchBundle\Ingester\Map\Filter;

use NDM\TryCatchBundle\Ingester\Map\ColumnDefinition;

use NDM\TryCatchBundle\Entity\Component;

use NDM\TryCatchBundle\Entity\ComponentChannel;

use Doctrine\ORM\EntityManager;
use NDM\TryCatchBundle\Ingester\Writer\ObjectWriter;
use NDM\TryCatchBundle\Entity\Channel;

use Doctrine\Common\Collections\ArrayCollection;

class ChannelFilter extends CollectionFilter {

	/**
	 * @var EntityManager
	 */
	private $om;

	public function __construct(EntityManager $om) {
		$this->om = $om;
	}

	public function filter($value, $entity, array $record = array(), ColumnDefinition $to) {
		$items = parent::filter($value, $entity, $record, $to);

		if(!count($items)) {
			return new ArrayCollection();
		}

		foreach($items as $i => $item) {
			$items[$i] = $this->writeChannel($item, $entity, $record);
		}

		return new ArrayCollection($items);
	}

	protected function writeChannel($channel, Component $component, array $record = array()) {
		list($name, $version) = explode('@', $channel);


		foreach($component->getChannels() as $recordEntity) {
			if(trim(strtolower($name)) == trim(strtolower($recordEntity->getChannel()->getName()))) {
				$recordEntity->setVersion($version);
				$this->om->persist($recordEntity);
				return $recordEntity;
			}
		}

		$channel = $this->om->getRepository('NDMTryCatchBundle:Channel')->findOneBy(array('name' => trim($name)));
		if(!$channel) {
			$channel = new Channel();
			$channel->setName($name);
			$this->om->persist($channel);
		}

		$recordEntity = new ComponentChannel();
		$recordEntity->setVersion($version);
		$recordEntity->setComponent($component);
		$recordEntity->setChannel($channel);

		$this->om->persist($recordEntity);

		return $recordEntity;
	}
}