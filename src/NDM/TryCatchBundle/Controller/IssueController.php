<?php

namespace NDM\TryCatchBundle\Controller;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Nelmio\ApiDocBundle\Annotation\ApiDoc;
use Doctrine\Common\Collections\ArrayCollection;
use FOS\RestBundle\Controller\Annotations as FOS;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;

class IssueController extends Controller {

	/**
     * @param string $_format The format to return the data in
     *
     * @ApiDoc(
	 *  resource=true,
	 *  description="List all of the issues over the last 7 days"
	 * )
	 *
	 * @FOS\View(templateVar="issues")
     *
	 */
	public function getIssuesAction() {

		return $this->getDoctrine()->getRepository('NDMTryCatchBundle:Issue')->findAllAsArray();
	}

	/**
     * @param string $_format The format to return the data in
     *
     * @ApiDoc(
	 *  resource=true,
	 *  description="Get a basic overview of the issues over the last 7 days"
	 * )
	 *
	 * @FOS\View(templateVar="issues")
	 */
	public function getIssuesOverviewAction() {
		return $this->getDoctrine()->getRepository('NDMTryCatchBundle:Issue')->findAllForGraph();
	}

	/**
     * @param string $_format The format to return the data in
     *
     * @ApiDoc(
	 *  resource=true,
	 *  description="Get a basic graph ready presentation of the issues"
	 * )
	 * @FOS\View(templateVar="issues")
	 */
	public function getIssuesGraphAction() {
		return $this->getDoctrine()->getRepository('NDMTryCatchBundle:Issue')->getGraphSummary();
	}

	/**
     * @param string $_format The format to return the data in
     *
     * @ApiDoc(
	 *  resource=true,
	 *  description="Get the highest open issue"
	 * )
	 * @FOS\View(templateVar="highest")
	 */
	public function getIssuesHighestAction() {
		return $this->render('NDMTryCatchBundle:Issue:highest.js.twig', array('highest' => rand(0, 4)));
	}
}