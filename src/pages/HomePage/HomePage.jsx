// 创建组件
import React, {Component,Fragment} from 'react';
import HomeContent from '../../components/HomeContent/HomeContent';
import Banner from '../../components/Banner/Banner';
import Footer from '../../components/Footer/Footer';
import './HomePage.css';

class HomePage extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }
    render() {
        return (
            <Fragment>
               <Banner/>
               <HomeContent/>
                <Footer/>
            </Fragment>
        )
    }
}

export default HomePage;
