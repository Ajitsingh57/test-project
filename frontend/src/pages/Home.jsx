import React from 'react'
import BannerHome from '../components/BannerHome'
import TestimonialsPage from '../components/TestimonialsPage'
import CategoriesHome from '../components/CategoriesHome'
import ComingSoonWatchesPage from '../components/ComingSoonWatchesPage'
import FashionPage from '../components/FashionPage'
import Footer from '../components/Footer'

export default function Home() {
  return (
    <div>
        <BannerHome></BannerHome>
        <CategoriesHome></CategoriesHome>
        <ComingSoonWatchesPage/>
        <FashionPage/>
        <TestimonialsPage/>
        <Footer/>
    </div>
  )
}
