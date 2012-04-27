<?php
namespace NDM\Bundle\TryCatch\ApiBundle\Controller;


use NDM\Bundle\TryCatch\ApiBundle\Ingester\Map\Transformer\ChannelFilter;

use NDM\Bundle\TryCatch\ApiBundle\Ingester\Map\ColumnDefinition;

use NDM\Bundle\TryCatch\ApiBundle\Ingester\Writer\MapWriter;

use NDM\Bundle\TryCatch\ApiBundle\Ingester\IssueIngester;

use NDM\Bundle\TryCatch\ApiBundle\Ingester\Reader\CSVReader;
use NDM\Bundle\TryCatch\ApiBundle\Ingester\Resource\FileResource;

use NDM\Bundle\TryCatch\ApiBundle\Entity\PlannedReleaseDate;

use Symfony\Component\HttpFoundation\Response;

use NDM\Bundle\TryCatch\ApiBundle\Entity\ComponentChannel;

use Doctrine\Common\Collections\ArrayCollection;

use NDM\Bundle\TryCatch\ApiBundle\Entity\Channel;

use NDM\Bundle\TryCatch\ApiBundle\Entity\Component;

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
			$entity->setComponent($this->getDoctrine()->getRepository('TryCatchApiBundle:Component')->findOneById(1));
			$entity->setChannel($this->getDoctrine()->getRepository('TryCatchApiBundle:Channel')->findOneById(1));
		}elseif($type === 'rel') {
			$entity = new PlannedReleaseDate();
			$entity->setDate(new \DateTime(date('Y-m-d H:i:s', strtotime('tommorow at 12pm'))));
			$entity->setComponent($this->getDoctrine()->getRepository('TryCatchApiBundle:Component')->findOneById(1));
			$entity->setChannel($this->getDoctrine()->getRepository('TryCatchApiBundle:Channel')->findOneById(1));
		}elseif($type === 'rel2') {
			$entity = new PlannedReleaseDate();
			$entity->setDate(new \DateTime(date('Y-m-d H:i:s', strtotime('tommorow at 12pm'))));
			$entity->setComponent($this->getDoctrine()->getRepository('TryCatchApiBundle:Component')->findOneById(2));
			$entity->setChannel($this->getDoctrine()->getRepository('TryCatchApiBundle:Channel')->findOneById(1));
		}

		$em = $this->getDoctrine()->getEntityManager();
		$em->persist($entity);
		$em->flush();

		return new Response((string) $entity);
	}

}