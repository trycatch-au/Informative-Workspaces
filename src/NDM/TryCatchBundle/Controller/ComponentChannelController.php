<?php

namespace NDM\TryCatchBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;
use NDM\TryCatchBundle\Entity\ComponentChannel;
use NDM\TryCatchBundle\Form\ComponentChannelType;

/**
 * ComponentChannel controller.
 *
 * @Route("/componentchannel")
 */
class ComponentChannelController extends Controller
{
    /**
     * Lists all ComponentChannel entities.
     *
     * @Route("/", name="componentchannel")
     * @Template()
     */
    public function indexAction()
    {
        $em = $this->getDoctrine()->getEntityManager();

        $entities = $em->getRepository('NDMTryCatchBundle:ComponentChannel')->findAll();

        return array(
            'entities' => $entities,
        );
    }

    /**
     * Finds and displays a ComponentChannel entity.
     *
     * @Route("/{id}/show", name="componentchannel_show")
     * @Template()
     */
    public function showAction($id)
    {
        $em = $this->getDoctrine()->getEntityManager();

        $entity = $em->getRepository('NDMTryCatchBundle:ComponentChannel')->find($id);

        if (!$entity) {
            throw $this->createNotFoundException('Unable to find ComponentChannel entity.');
        }

        $deleteForm = $this->createDeleteForm($id);

        return array(
            'entity'      => $entity,
            'delete_form' => $deleteForm->createView(),
        );
    }

    /**
     * Displays a form to create a new ComponentChannel entity.
     *
     * @Route("/new", name="componentchannel_new")
     * @Template()
     */
    public function newAction()
    {
        $entity = new ComponentChannel();
        $form   = $this->createForm(new ComponentChannelType(), $entity);

        return array(
            'entity' => $entity,
            'form'   => $form->createView(),
        );
    }

    /**
     * Creates a new ComponentChannel entity.
     *
     * @Route("/create", name="componentchannel_create")
     * @Method("post")
     * @Template("NDMTryCatchBundle:ComponentChannel:new.html.twig")
     */
    public function createAction()
    {
        $entity  = new ComponentChannel();
        $request = $this->getRequest();
        $form    = $this->createForm(new ComponentChannelType(), $entity);
        $form->bindRequest($request);

        if ($form->isValid()) {
            $em = $this->getDoctrine()->getEntityManager();
            $em->persist($entity);
            $em->flush();

            return $this->redirect($this->generateUrl('componentchannel_show', array('id' => $entity->getId())));
        }

        return array(
            'entity' => $entity,
            'form'   => $form->createView(),
        );
    }

    /**
     * Displays a form to edit an existing ComponentChannel entity.
     *
     * @Route("/{id}/edit", name="componentchannel_edit")
     * @Template()
     */
    public function editAction($id)
    {
        $em = $this->getDoctrine()->getEntityManager();

        $entity = $em->getRepository('NDMTryCatchBundle:ComponentChannel')->find($id);

        if (!$entity) {
            throw $this->createNotFoundException('Unable to find ComponentChannel entity.');
        }

        $editForm = $this->createForm(new ComponentChannelType(), $entity);
        $deleteForm = $this->createDeleteForm($id);

        return array(
            'entity'      => $entity,
            'edit_form'   => $editForm->createView(),
            'delete_form' => $deleteForm->createView(),
        );
    }

    /**
     * Edits an existing ComponentChannel entity.
     *
     * @Route("/{id}/update", name="componentchannel_update")
     * @Method("post")
     * @Template("NDMTryCatchBundle:ComponentChannel:edit.html.twig")
     */
    public function updateAction($id)
    {
        $em = $this->getDoctrine()->getEntityManager();

        $entity = $em->getRepository('NDMTryCatchBundle:ComponentChannel')->find($id);

        if (!$entity) {
            throw $this->createNotFoundException('Unable to find ComponentChannel entity.');
        }

        $editForm   = $this->createForm(new ComponentChannelType(), $entity);
        $deleteForm = $this->createDeleteForm($id);

        $request = $this->getRequest();

        $editForm->bindRequest($request);

        if ($editForm->isValid()) {
            $em->persist($entity);
            $em->flush();

            return $this->redirect($this->generateUrl('componentchannel_edit', array('id' => $id)));
        }

        return array(
            'entity'      => $entity,
            'edit_form'   => $editForm->createView(),
            'delete_form' => $deleteForm->createView(),
        );
    }

    /**
     * Deletes a ComponentChannel entity.
     *
     * @Route("/{id}/delete", name="componentchannel_delete")
     * @Method("post")
     */
    public function deleteAction($id)
    {
        $form = $this->createDeleteForm($id);
        $request = $this->getRequest();

        $form->bindRequest($request);

        if ($form->isValid()) {
            $em = $this->getDoctrine()->getEntityManager();
            $entity = $em->getRepository('NDMTryCatchBundle:ComponentChannel')->find($id);

            if (!$entity) {
                throw $this->createNotFoundException('Unable to find ComponentChannel entity.');
            }

            $em->remove($entity);
            $em->flush();
        }

        return $this->redirect($this->generateUrl('componentchannel'));
    }

    private function createDeleteForm($id)
    {
        return $this->createFormBuilder(array('id' => $id))
            ->add('id', 'hidden')
            ->getForm()
        ;
    }
}
