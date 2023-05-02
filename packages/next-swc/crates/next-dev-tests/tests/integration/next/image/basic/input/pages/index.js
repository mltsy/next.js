import Image from 'next/image'
import { img } from '../components/img'
import broken from '../public/broken.jpeg'
import svg from '../public/test.svg'
import brokenSvg from '../public/broken.svg'
import { useEffect } from 'react'

export default function Home() {
  useEffect(() => {
    // Only run on client
    import('@turbo/pack-test-harness').then(runTests)
  })

  return [
    <Image
      id="imported"
      alt="test imported image"
      src={img}
      placeholder="blur"
    />,
    <Image id="svg" alt="test svg image" src={svg} />,
    <Image
      id="local"
      alt="test src image"
      src="/triangle-black.png"
      width="116"
      height="100"
    />,
    <Image
      id="broken"
      alt="test imported broken image"
      src={broken}
      placeholder="blur"
    />,
    <Image
      id="broken-svg"
      alt="test imported broken svg image"
      src={brokenSvg}
    />,
  ]
}

console.log(img)
function runTests() {
  it('should return image size', function () {
    expect(img).toHaveProperty('width', 116)
    expect(img).toHaveProperty('height', 100)
  })

  it('should return image size for svg', function () {
    expect(svg).toHaveProperty('width', 400)
    expect(svg).toHaveProperty('height', 400)
  })

  it('should return fake image size for broken images', function () {
    expect(broken).toHaveProperty('width', 100)
    expect(broken).toHaveProperty('height', 100)
    expect(brokenSvg).toHaveProperty('width', 100)
    expect(brokenSvg).toHaveProperty('height', 100)
  })

  it('should have blur placeholder', function () {
    expect(img).toHaveProperty(
      'blurDataURL',
      expect.stringMatching(/^data:image\/png;base64/)
    )
    expect(img).toHaveProperty('blurWidth', 8)
    expect(img).toHaveProperty('blurHeight', 7)
  })

  it('should not have blur placeholder for svg', function () {
    expect(svg).toHaveProperty('blurDataURL', null)
    expect(svg).toHaveProperty('blurWidth', 0)
    expect(svg).toHaveProperty('blurHeight', 0)
  })

  it('should have fake blur placeholder for broken images', function () {
    expect(broken).toHaveProperty(
      'blurDataURL',
      expect.stringContaining('data:')
    )
    expect(broken).toHaveProperty('blurWidth', 1)
    expect(broken).toHaveProperty('blurHeight', 1)
  })

  it('should link to imported image', function () {
    const img = document.querySelector('#imported')
    expect(img.src).toContain(encodeURIComponent('_next/static/assets'))
  })

  it('should link to imported svg image', function () {
    const img = document.querySelector('#svg')
    expect(img.src).toContain('_next/static/assets')
  })

  it('should link to local src image', function () {
    const img = document.querySelector('#local')
    expect(img.src).toContain('triangle-black')
  })

  it('should link to imported broken image', function () {
    const img = document.querySelector('#broken')
    expect(img.src).toContain(encodeURIComponent('_next/static/assets'))
  })

  it('should link to imported broken svg image', function () {
    const img = document.querySelector('#broken-svg')
    expect(img.src).toContain('_next/static/assets')
  })
}
