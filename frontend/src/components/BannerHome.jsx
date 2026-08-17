import React, { useEffect ,useRef} from 'react'
import {bannerHomeStyles } from '../assets/dummyStyles'
import video from '../assets/bannerVideo.mp4';
import Navbar from './Navbar'
import BL1 from '../assets/BL1.png'
import BM1 from '../assets/BM1.png'
import BR1 from '../assets/BR1.png'

export default function BannerHome() {
    const videoRef=useRef(null);
    useEffect(()=>{
      const reduceMotion=window.matchMedia && window.matchMedia("(prefers-reduced-motion:reduce)").matches;
      if(reduceMotion && videoRef.current){
        videoRef.current.pause();
        videoRef.current.removeAtrribute("autoplay");
      }
    },[])
  return (
    <div className={bannerHomeStyles.container}>
      <div className={bannerHomeStyles.navbarWrapper}>
     <Navbar/>

      </div>
      <div className={bannerHomeStyles.videoContainer}>
        <video ref={videoRef} className={bannerHomeStyles.video} autoPlay muted loop playsInline preload="metadata" poster='/fallback.jpg' role='presentation'>
        <source src={video} type='video/mp4'/>
        </video>
      </div>
      <div className={bannerHomeStyles.contentContainer}>
        <div className={bannerHomeStyles.h1Container}>
          <h1 style={bannerHomeStyles.playfairFont} className={bannerHomeStyles.h1Text}>
        <span className={bannerHomeStyles.h1SpanGray}>Love you more</span>
        <span className={bannerHomeStyles.h1SpanYellow}>with each tick-tock </span>
          </h1>
          <p className={bannerHomeStyles.subtext}>
            Dicover our  exclusive collection of handcrafted timepieces that embody precesion , luxury and tiemless style
          </p>
        </div>
        <div className={bannerHomeStyles.cardsContainer}>
          <div className={bannerHomeStyles.grid}>
            <div className={`${bannerHomeStyles.cardWrapper} ${bannerHomeStyles.leftCardTransform}`}>
              <div className={`${bannerHomeStyles.cardBase} ${bannerHomeStyles.cardPadding}`}>
                <img src={BL1} alt="Left Logo" className={`${bannerHomeStyles.cardImage} ${bannerHomeStyles.leftCardImage}`} loading='lazy' />
              </div>
              <p className={`${bannerHomeStyles.cardLabel} ${bannerHomeStyles.cardLabelGray}`}>
                Classic heritage
              </p>
            </div>
            <div className={`${bannerHomeStyles.cardWrapper} ${bannerHomeStyles.middleCardTransform}`}>
              <div className={`${bannerHomeStyles.cardMiddle} ${bannerHomeStyles.cardPadding}`}>
                <img src={BM1} alt="Middle Logo" className={`${bannerHomeStyles.cardImage} ${bannerHomeStyles.middleCardImage}`} loading='lazy' />
              </div>
              <p className={`${bannerHomeStyles.cardLabel} ${bannerHomeStyles.cardLabelYellow}`}>
                Limited Edition
              </p>
            </div>
            <div className={`${bannerHomeStyles.cardWrapper} ${bannerHomeStyles.rightCardTransform}`}>
              <div className={`${bannerHomeStyles.cardBase} ${bannerHomeStyles.cardPadding}`}>
                <img src={BR1} alt="Right Logo" className={`${bannerHomeStyles.cardImage} ${bannerHomeStyles.rightCardImage}`} loading='lazy' />
              </div>
              <p className={`${bannerHomeStyles.cardLabel} ${bannerHomeStyles.cardLabelGray}`}>
                Modern Edition
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    
  )
}
