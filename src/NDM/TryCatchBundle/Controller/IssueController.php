<?php
namespace NDM\TryCatchBundle\Controller;

use NDM\TryCatchBundle\Issue\Timeline\Event;

use NDM\TryCatchBundle\Issue\Timeline;

use NDM\TryCatchBundle\Issue;

use Doctrine\Common\Collections\ArrayCollection;

use FOS\RestBundle\Controller\Annotations as FOS;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
/**
 * @author davidmann
 *
 */
class IssueController extends Controller {

	/**
	 * @FOS\View(templateVar="issues")
	 */
	public function getIssuesAction() {
		return $this->getDoctrine()->getRepository('NDMTryCatchBundle:Issue')->findAllAsArray();
	}

	/**
	 * @FOS\View(templateVar="issues")
	 */
	public function getIssuesGraphAction() {
		return $this->getDoctrine()->getRepository('NDMTryCatchBundle:Issue')->findAllForGraph();
	}

	/**
	 * @FOS\View(templateVar="issues")
	 */
	public function getIssuesGraphSummaryAction() {
		return $this->getDoctrine()->getRepository('NDMTryCatchBundle:Issue')->getGraphSummary();
	}

	/**
	 * @FOS\View(templateVar="highest")
	 */
	public function getIssuesHighestAction() {
		return $this->render('NDMTryCatchBundle:Issue:highest.js.twig', array('highest' => rand(0, 4)));
	}

	/**
	 * @FOS\View(templateVar="channels")
	 */
	public function getIssuesHistoryAction() {
		$channels = array(
			'P1' => array(rand(0, 10), rand(0, 10), rand(0, 10), rand(0, 10), rand(0, 10), rand(0, 10), rand(0, 10)),
			'P2' => array(rand(0, 10), rand(0, 10), rand(0, 10), rand(0, 10), rand(0, 10), rand(0, 10), rand(0, 10)),
			'P3' => array(rand(0, 10), rand(0, 10), rand(0, 10), rand(0, 10), rand(0, 10), rand(0, 10), rand(0, 10)),
			'P4' => array(rand(0, 10), rand(0, 10), rand(0, 10), rand(0, 10), rand(0, 10), rand(0, 10), rand(0, 10))
		);
		return $channels;
	}
}