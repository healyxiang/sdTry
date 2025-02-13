import { Smile, ChartBar, MousePointer, TabletSmartphone, Sun } from 'lucide-react'

import benefitOneImg from '@/../public/static/images/benefit-one.png'
import benefitTwoImg from '@/../public/static/images/benefit-two.png'

const benefitOne = {
  title: 'Highlight your benefits',
  desc: 'You can use this space to highlight your first benefit or a feature of your product. It can also contain an image or Illustration like in the example along with some bullet points.',
  image: benefitOneImg,
  bullets: [
    {
      title: 'Understand your customers',
      desc: 'Then explain the first point breifly in one or two lines.',
      icon: <Smile />,
    },
    {
      title: 'Improve acquisition',
      desc: 'Here you can add the next benefit point.',
      icon: <ChartBar />,
    },
    {
      title: 'Drive customer retention',
      desc: 'This will be your last bullet point in this section.',
      icon: <TabletSmartphone />,
    },
  ],
}

const benefitTwo = {
  title: 'Offer more benefits here',
  desc: 'You can use this same layout with a flip image to highlight your rest of the benefits of your product. It can also contain an image or Illustration as above section along with some bullet points.',
  image: benefitTwoImg,
  bullets: [
    {
      title: 'Mobile Responsive Template',
      desc: 'Nextly is designed as a mobile first responsive template.',
      icon: <TabletSmartphone />,
    },
    {
      title: 'Powered by Next.js & TailwindCSS',
      desc: 'This template is powered by latest technologies and tools.',
      icon: <MousePointer />,
    },
    {
      title: 'Dark & Light Mode',
      desc: 'Nextly comes with a zero-config light & dark mode. ',
      icon: <Sun />,
    },
  ],
}

export { benefitOne, benefitTwo }
