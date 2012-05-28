<?php

namespace NDM\Bundle\TryCatch\ApiBundle\DependencyInjection;

use Symfony\Component\Config\Definition\Builder\TreeBuilder;
use Symfony\Component\Config\Definition\ConfigurationInterface;

/**
 * This is the class that validates and merges configuration from your app/config files
 *
 * To learn more see {@link http://symfony.com/doc/current/cookbook/bundles/extension.html#cookbook-bundles-extension-config-class}
 */
class Configuration implements ConfigurationInterface
{
    /**
     * {@inheritDoc}
     */
    public function getConfigTreeBuilder()
    {
        $treeBuilder = new TreeBuilder();
        $rootNode = $treeBuilder->root('try_catch_api');

        $rootNode
        	->addDefaultsIfNotSet()
        	->children()
				->arrayNode('ingesters')
					->useAttributeAsKey('name')
					->prototype('array')
						->beforeNormalization()->always(function($v) {
        					return $v;
        				})->end()
        				->children()
        					->scalarNode('class')->isRequired()->end()
	        				->arrayNode('mappings')
        						->prototype('array')
									->beforeNormalization()->always(function($v) {
        								if(!isset($v['to'])) {
        									$v['to'] = $v['from'];
        								}

        								if(isset($v['type'])) {
        									$v['transformers'] = isset($v['transformers']) && $v['transformers'] ? array_merge(array($v['type']), $v['transformers']) : array($v['type']);
        									unset($v['type']);
        								}

			        					return $v;
			        				})->end()
		        					->children()
		        						->scalarNode('from')->isRequired()->end()
		        						->scalarNode('to')->end()
		        						->arrayNode('transformers')
		        							->defaultValue(array())
		        							->prototype('scalar')->end()
		        						->end()
		        					->end()
	        					->end()
	        				->end()
        				->end()
					->end()
				->end()
        	->end();

        return $treeBuilder;
    }
}
