<?php

namespace NDM\Bundle\TryCatch\ApiBundle\Controller;

use Nelmio\ApiDocBundle\Annotation\ApiDoc;
use Symfony\Component\HttpFoundation\Response;
use NDM\Bundle\TryCatch\ApiBundle\Ingester\Resource\StringResource;
use FOS\RestBundle\Controller\Annotations as FOS;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;

/**
 * @author davidmann
 *
 */
class ApiController extends Controller {

	/**
     * @param string $type The type of data being ingested (incidents, components)
     * @param string $_format The format to return the data in
     *
     * @FOS\View(templateVar="resources")
     *
	 * @ApiDoc(
	 *  resource=true,
	 *  description="Ingests data",
	 *  filters = {
	 *      { "name" = "data","dataType" = "string", "description" = "The data to be imported, urlencoded", "required" = "true" }
	 *  }
	 * )
	 */
	public function postIngestAction($type) {
		if($type === 'incidents') {
			$ingester = 'incidents';
		}elseif($type === 'components') {
			$ingester = 'components';
		}elseif($type === 'instances') {
			$ingester = 'channels';
		}else{
			throw $this->createNotFoundException('Invalid ingestment type');
		}

		$data = stripslashes($_POST['data']);

		if(!$data) {
			throw $this->createNotFoundException('Invalid ingestment data');
		}

		$ingested = $this->get(sprintf('ndm_try_catch.%s_ingester', $ingester))->ingest(new StringResource($data));

		$this->getDoctrine()->getEntityManager()->flush();

		return new Response(count($ingested));
	}
}