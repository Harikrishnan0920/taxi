import React from 'react'
import { Carousel } from 'antd';
import Movies from './Movies';

function HeroComponent() {
    const contentStyle = {
        margin: 0,
        width: "100vw",
        height: '100vh',
        color: '#fff',
        background: '#364d79',
    };
    const onChange = (currentSlide) => {
        console.log('Slide Number',currentSlide);
    };
    return (
        <div className='heroComponent-container'>

            <div className='hero-content'>
                <div className='hero-carousel'>
                    <Carousel
                        afterChange={onChange}
                        autoplay
                    >
                        <div >
                            <div style={contentStyle}>
                                <img src='https://img10.hotstar.com/image/upload/f_auto/sources/r1/cms/prod/9293/809293-i' style={{ width: "100%", height: "100%" }} />
                            </div>
                        </div>
                        <div >
                            <div style={contentStyle}>
                                <img src='https://img10.hotstar.com/image/upload/f_auto,q_90,w_1920/sources/r1/cms/prod/2479/1622479-i-48fcf81b0925' style={{ width: "100%", height: "100%" }} />
                            </div>
                        </div>
                        <div >
                            <div style={contentStyle}>
                                <img src='https://img10.hotstar.com/image/upload/f_auto,q_90,w_1920/sources/r1/cms/prod/771/1630771-i-d241d32519f1' style={{ width: "100%", height: "100%" }} />
                            </div>
                        </div>

                    </Carousel>
                </div>
                <div>
                    <div className='hero-overlay'>
                <h1>Unlock the Magic of Cinema 🪄</h1>
                <p>Where Every Search Tells a Story</p> 
                <div className='swipedown-msg'>Swipe down and View new releases</div>
                    </div>
                    
                    <div className='body-container'>
                       <Movies hidesearch={'hide'} />
                    </div>
                </div>
            </div>

        </div>
    )
}

export default HeroComponent