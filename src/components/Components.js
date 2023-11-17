import { defineAsyncComponent } from 'vue'
export const Components = [
  {
    id: 1,
    type: 'Text',
    name: '文本',
    icon: '#-ico-text',

    data: {}
  },
  {
    id: 2,
    type: 'RichText',
    name: '富文本',
    icon: '#-ico-richtext'
  },
  {
    id: 3,
    type: 'Split',
    name: '分割占位',
    icon: '#-ico-split',

    data: {
      type: 'line',
      lineType: 'solid',
      paddingLR: 12,
      paddingTB: 20,
      height: 40,
      size: 1,
      color: { r: 225, g: 225, b: 225, a: 1 }
    }
  },
  {
    id: 4,
    type: 'Carousel',
    name: '轮播图',
    icon: '#-ico-carousel',

    data: {}
  },
  {
    id: 5,
    type: 'Image',
    name: '图片',
    icon: '#-ico-image',

    data: {}
  }
]

export const componentList = {
  Carousel: defineAsyncComponent(() => import('../components/Carousel.vue')),
  Image: defineAsyncComponent(() => import('../components/Image.vue')),
  RichText: defineAsyncComponent(() => import('../components/RichText.vue')),
  Split: defineAsyncComponent(() => import('../components/Split.vue')),
  Text: defineAsyncComponent(() => import('../components/Text.vue'))
}
export const propsList = {
  CarouselProps: defineAsyncComponent(() => import('../components/CarouselProps.vue')),
  ImageProps: defineAsyncComponent(() => import('../components/ImageProps.vue')),
  RichTextProps: defineAsyncComponent(() => import('../components/RichTextProps.vue')),
  SplitProps: defineAsyncComponent(() => import('../components/SplitProps.vue')),
  TextProps: defineAsyncComponent(() => import('../components/TextProps.vue')),
  HeaderNavProps: defineAsyncComponent(() => import('../components/HeaderNavProps.vue')),
  FooterNavProps: defineAsyncComponent(() => import('../components/FooterNavProps.vue'))
}
