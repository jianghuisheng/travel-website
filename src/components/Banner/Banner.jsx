// 创建组件
import React, {Component} from 'react';
import './Banner.css';
import 'swiper/dist/css/swiper.min.css';
import Swiper from 'swiper/dist/js/swiper.js';
import b1 from '../../images/bg4.jpg';
import b2 from '../../images/bg5.jpg';
import b3 from '../../images/bg3.jpg';
import bannerLogin from '../../images/small.png';


class Banner extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    componentDidMount() {
        new Swiper('.swiper-container', {
            loop: true,
            autoplay: {
                delay: 3000,
                disableOnInteraction: false,
            }
        });
    }
    render() {
        return (
            <div className='banner'>
                <div className='text'>
                    <h1 className='left'>探</h1>
                        <img className='small' src={bannerLogin} alt=""/>
                    <h1 className='right'>索</h1>
                    <h1 className='bottom'>世界的美好</h1>
                </div>
                {/*轮播图*/}
                <div className="swiper-container">
                    <div className="swiper-wrapper">
                        <div className="swiper-slide">
                            <img src={b1} alt=""/>
                        </div>
                        <div className="swiper-slide">
                            <img src={b2} alt=""/>
                        </div>
                        <div className="swiper-slide">
                            <img src={b3} alt=""/>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Banner;
