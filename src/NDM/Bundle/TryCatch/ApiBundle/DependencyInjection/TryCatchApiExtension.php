<?php

namespace NDM\Bundle\TryCatch\ApiBundle\DependencyInjection;

use Symfony\Component\DependencyInjection\Exception\ServiceNotFoundException;
use Symfony\Component\DependencyInjection\Reference;
use Symfony\Component\DependencyInjection\DefinitionDecorator;
use Symfony\Component\DependencyInjection\Definition;
use Symfony\Component\DependencyInjection\ContainerBuilder;
use Symfony\Component\Config\FileLocator;
use Symfony\Component\HttpKernel\DependencyInjection\Extension;
use Symfony\Component\DependencyInjection\Loader;

/**
 * This is the class that loads and manages your bundle configuration
 *
 * To learn more see {@link http://symfony.com/doc/current/cookbook/bundles/extension.html}
 */
class TryCatchApiExtension extends Extension
{
    /**
     * {@inheritDoc}
     */
    public function load(array $configs, ContainerBuilder $container)
    {
        $configuration = new Configuration();
        $config = $this->processConfiguration($configuration, $configs);

        $loader = new Loader\XmlFileLoader($container, new FileLocator(__DIR__.'/../Resources/config'));
        $loader->load('services.xml');
        foreach($config['ingesters'] as $name => $ingester) {
            $this->registerIngester($name, $ingester, $container);
        }
    }

    protected function registerIngester($name, array $ingester, ContainerBuilder $container) {
		$writer = $this->registerWriter($ingester, $container);

		$reader = new Reference('ndm_try_catch.ingester.reader_resolver');
    	$ingester = new Definition($ingester['class'], array(new Reference('doctrine.orm.default_entity_manager')));
    	$ingesterContainer =  new Definition('NDM\\Bundle\\TryCatch\\ApiBundle\\Ingester\\IngesterContainer', array(new Reference(sprintf('ndm_try_catch.ingester.%s', $name)), $reader, $writer));

    	$container->setDefinition(sprintf('ndm_try_catch.ingester.%s', $name), $ingester);
    	$container->setDefinition(sprintf('ndm_try_catch.%s_ingester', $name), $ingesterContainer);
    }

    protected function registerWriter(array $ingester, ContainerBuilder $container) {
    	if(isset($ingester['mappings'])) {
    		$writer = new Definition('NDM\\Bundle\\TryCatch\\ApiBundle\\Ingester\\Writer\\MapWriter');
    		foreach($ingester['mappings'] as $mapping) {
    			foreach($mapping['transformers'] as $i => $transformer) {
    				if(!is_string($transformer)) {
    					continue;

    				}
    				$transformerId = sprintf('ndm_try_catch.ingester.transformer_%s', $transformer);

    				if(!$container->hasDefinition($transformerId)) {
    					throw new ServiceNotFoundException($transformerId);
    				}

    				$mapping['transformers'][$i] = new Reference($transformerId);
    			}

    			$colDefArgs = array(
    				$mapping['from'],
    				$mapping['to'],
    				$mapping['transformers'],
    			);
				$colDef = new Definition('NDM\\Bundle\\TryCatch\\ApiBundle\\Ingester\\Map\\ColumnDefinition', $colDefArgs);
				$writer->addMethodCall('registerColumnDefinition', array($colDef));
    		}

    		return $writer;
    	}
    }
}
