<?php
namespace NDM\TryCatchBundle\Controller;


use NDM\TryCatchBundle\Ingester\Map\Filter\ChannelFilter;

use NDM\TryCatchBundle\Ingester\Map\ColumnDefinition;

use NDM\TryCatchBundle\Ingester\Writer\MapWriter;

use NDM\TryCatchBundle\Ingester\IssueIngester;

use NDM\TryCatchBundle\Ingester\Reader\CSVReader;
use NDM\TryCatchBundle\Ingester\Resource\FileResource;

use NDM\TryCatchBundle\Entity\PlannedReleaseDate;

use Symfony\Component\HttpFoundation\Response;

use NDM\TryCatchBundle\Entity\ComponentChannel;

use Doctrine\Common\Collections\ArrayCollection;

use NDM\TryCatchBundle\Entity\Channel;

use NDM\TryCatchBundle\Entity\Component;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;

class LoadDataController extends Controller {

	/**
	 * @param unknown_type $type
	 * @Route("/load/{type}")
	 */
	public function loadDataAction($type) {
		if($type === 'test') {


			$resource = new FileResource(__DIR__ . '/../Resources/data/incidents.csv');

			ladybug_set('object.max_nesting_level', 5);

			ldd($this->get('ndm_try_catch.incidents_ingester')->ingest($resource));
			return new Response('<html><body>asdasd</body></html>');
		}


		if($type === 'component') {
			$entity = new Component();
			$entity->setName('TryCatchApi');
			$entity->setVersion('0.0.1a');
		}elseif($type === 'channel') {
			$entity = new Channel();
			$entity->setName('TryCatchApi');
		}elseif($type === 'comchan') {
			$entity = new ComponentChannel();
			$entity->setComponent($this->getDoctrine()->getRepository('NDMTryCatchBundle:Component')->findOneById(1));
			$entity->setChannel($this->getDoctrine()->getRepository('NDMTryCatchBundle:Channel')->findOneById(1));
		}elseif($type === 'rel') {
			$entity = new PlannedReleaseDate();
			$entity->setDate(new \DateTime(date('Y-m-d H:i:s', strtotime('tommorow at 12pm'))));
			$entity->setComponent($this->getDoctrine()->getRepository('NDMTryCatchBundle:Component')->findOneById(1));
			$entity->setChannel($this->getDoctrine()->getRepository('NDMTryCatchBundle:Channel')->findOneById(1));
		}elseif($type === 'rel2') {
			$entity = new PlannedReleaseDate();
			$entity->setDate(new \DateTime(date('Y-m-d H:i:s', strtotime('tommorow at 12pm'))));
			$entity->setComponent($this->getDoctrine()->getRepository('NDMTryCatchBundle:Component')->findOneById(2));
			$entity->setChannel($this->getDoctrine()->getRepository('NDMTryCatchBundle:Channel')->findOneById(1));
		}

		$em = $this->getDoctrine()->getEntityManager();
		$em->persist($entity);
		$em->flush();

		return new Response((string) $entity);
	}

}