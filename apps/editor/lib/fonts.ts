import { Inter, Lora, Montserrat, Open_Sans, Playfair_Display, Poppins, Roboto } from 'next/font/google'

export const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
})

export const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

export const openSans = Open_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-open-sans',
})

export const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-roboto',
})

export const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-montserrat',
})

export const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-playfair-display',
})

export const lora = Lora({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-lora',
})

export const fontVariableClasses = [
  poppins.variable,
  inter.variable,
  openSans.variable,
  roboto.variable,
  montserrat.variable,
  playfairDisplay.variable,
  lora.variable,
].join(' ')
