<?php

namespace NDM\Bundle\TryCatch\ApiBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;
use NDM\Bundle\TryCatch\ApiBundle\Entity\PlannedReleaseDate;
use NDM\Bundle\TryCatch\ApiBundle\Form\PlannedReleaseDateType;

/**
 * PlannedReleaseDate controller.
 *
 * @Route("/plannedreleasedate")
 */
class PlannedReleaseDateController extends Controller
{
    /**
     * Lists all PlannedReleaseDate entities.
     *
     * @Route("/", name="plannedreleasedate")
     * @Template()
     */
    public function indexAction()
    {
        $em = $this->getDoctrine()->getEntityManager();

        $entities = $em->getRepository('TryCatchApiBundle:PlannedReleaseDate')->findAll();

        return array(
            'entities' => $entities,
        );
    }

    /**
     * Finds and displays a PlannedReleaseDate entity.
     *
     * @Route("/{id}/show", name="plannedreleasedate_show")
     * @Template()
     */
    public function showAction($id)
    {
        $em = $this->getDoctrine()->getEntityManager();

        $entity = $em->getRepository('TryCatchApiBundle:PlannedReleaseDate')->find($id);

        if (!$entity) {
            throw $this->createNotFoundException('Unable to find PlannedReleaseDate entity.');
        }

        $deleteForm = $this->createDeleteForm($id);

        return array(
            'entity'      => $entity,
            'delete_form' => $deleteForm->createView(),
        );
    }

    /**
     * Displays a form to create a new PlannedReleaseDate entity.
     *
     * @Route("/new", name="plannedreleasedate_new")
     * @Template()
     */
    public function newAction()
    {
        $entity = new PlannedReleaseDate();
        $form   = $this->createForm(new PlannedReleaseDateType(), $entity);

        return array(
            'entity' => $entity,
            'form'   => $form->createView(),
        );
    }

    /**
     * Creates a new PlannedReleaseDate entity.
     *
     * @Route("/create", name="plannedreleasedate_create")
     * @Method("post")
     * @Template("TryCatchApiBundle:PlannedReleaseDate:new.html.twig")
     */
    public function createAction()
    {
        $entity  = new PlannedReleaseDate();
        $request = $this->getRequest();
        $form    = $this->createForm(new PlannedReleaseDateType(), $entity);
        $form->bindRequest($request);

        if ($form->isValid()) {
            $em = $this->getDoctrine()->getEntityManager();
            $em->persist($entity);
            $em->flush();

            return $this->redirect($this->generateUrl('plannedreleasedate_show', array('id' => $entity->getId())));
        }

        return array(
            'entity' => $entity,
            'form'   => $form->createView(),
        );
    }

    /**
     * Displays a form to edit an existing PlannedReleaseDate entity.
     *
     * @Route("/{id}/edit", name="plannedreleasedate_edit")
     * @Template()
     */
    public function editAction($id)
    {
        $em = $this->getDoctrine()->getEntityManager();

        $entity = $em->getRepository('TryCatchApiBundle:PlannedReleaseDate')->find($id);

        if (!$entity) {
            throw $this->createNotFoundException('Unable to find PlannedReleaseDate entity.');
        }

        $editForm = $this->createForm(new PlannedReleaseDateType(), $entity);
        $deleteForm = $this->createDeleteForm($id);

        return array(
            'entity'      => $entity,
            'edit_form'   => $editForm->createView(),
            'delete_form' => $deleteForm->createView(),
        );
    }

    /**
     * Edits an existing PlannedReleaseDate entity.
     *
     * @Route("/{id}/update", name="plannedreleasedate_update")
     * @Method("post")
     * @Template("TryCatchApiBundle:PlannedReleaseDate:edit.html.twig")
     */
    public function updateAction($id)
    {
        $em = $this->getDoctrine()->getEntityManager();

        $entity = $em->getRepository('TryCatchApiBundle:PlannedReleaseDate')->find($id);

        if (!$entity) {
            throw $this->createNotFoundException('Unable to find PlannedReleaseDate entity.');
        }

        $editForm   = $this->createForm(new PlannedReleaseDateType(), $entity);
        $deleteForm = $this->createDeleteForm($id);

        $request = $this->getRequest();

        $editForm->bindRequest($request);

        if ($editForm->isValid()) {
            $em->persist($entity);
            $em->flush();

            return $this->redirect($this->generateUrl('plannedreleasedate_edit', array('id' => $id)));
        }

        return array(
            'entity'      => $entity,
            'edit_form'   => $editForm->createView(),
            'delete_form' => $deleteForm->createView(),
        );
    }

    /**
     * Deletes a PlannedReleaseDate entity.
     *
     * @Route("/{id}/delete", name="plannedreleasedate_delete")
     * @Method("post")
     */
    public function deleteAction($id)
    {
        $form = $this->createDeleteForm($id);
        $request = $this->getRequest();

        $form->bindRequest($request);

        if ($form->isValid()) {
            $em = $this->getDoctrine()->getEntityManager();
            $entity = $em->getRepository('TryCatchApiBundle:PlannedReleaseDate')->find($id);

            if (!$entity) {
                throw $this->createNotFoundException('Unable to find PlannedReleaseDate entity.');
            }

            $em->remove($entity);
            $em->flush();
        }

        return $this->redirect($this->generateUrl('plannedreleasedate'));
    }

    private function createDeleteForm($id)
    {
        return $this->createFormBuilder(array('id' => $id))
            ->add('id', 'hidden')
            ->getForm()
        ;
    }
}
