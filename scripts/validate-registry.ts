import { blockTypes } from '../packages/registry/src/block-registry'

const componentMap: Record<string, string> = {
  hero: 'HeroBlock',
  featureGrid: 'FeatureGridBlock',
  cta: 'CTABlock',
  footer: 'FooterBlock',
}

const missing = blockTypes.filter((type) => !componentMap[type])

if (missing.length) {
  console.error('validate-registry failed: missing components for', missing.join(', '))
  process.exit(1)
}

console.log('validate-registry OK')
