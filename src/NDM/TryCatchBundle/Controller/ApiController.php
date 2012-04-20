<?php
namespace NDM\TryCatchBundle\Controller;

use Symfony\Component\HttpFoundation\Response;

use NDM\TryCatchBundle\Ingester\Resource\StringResource;

use FOS\RestBundle\Controller\Annotations as FOS;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
/**
 * @author davidmann
 *
 */
class ApiController extends Controller {

	/**
     * @FOS\View(templateVar="resources")
	 */
	public function postIngestAction($type) {
		if($type === 'incidents') {
			$ingester = 'incidents';
		}elseif($type === 'components') {
			$ingester = 'components';
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