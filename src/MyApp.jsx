
import React, {Component} from 'react';
import {Icon} from 'antd';
import HomePage from './pages/HomePage/HomePage';
import HeaderNav from './components/HeaderNav/HeaderNav';
import LoginSection from './pages/LoginSection/LoginSection';
import ZhuceSection from './pages/ZhuceSection/ZhuceSection';
import About from './pages/About/About';
import MyselfInfo from './pages/MyselfInfo/MyselfInfo';
import Destination from './pages/Destination/Destination';
import Line from './pages/Line/Line';
import Theme from './pages/Theme/Theme';
import Travels from './pages/Travels/Travels';
import Search from './pages/Search/Search';
import Admin from './pages/Admin/Admin';
import CargoDetail from './components/CargoDetail/CargoDetail';
import CargoUpdate from './components/CargoUpdate/CargoUpdate';
import Comment from './components/Comment/Comment';
import sider from './images/sider.png';
import siderTop from './images/siderTop.png';

import {BrowserRouter as Router,Route} from 'react-router-dom';
import './MyApp.css';


class MyApp extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }
    render() {
        return (
            <div className='my-app'>
                <div className='bg_footer'></div>
               <Router>
                   <div className='main'>
                       <HeaderNav/>
                       <div className='chat'>
                            <div className='sider-top'>
                                <img src={siderTop} className='siderTop' alt='/'/>
                            </div>
                           <div className='sider-bottom'>
                               <img className='sider1' src={sider} alt=""/>
                               <span><Icon type='qq' style={{fontSize:'16px',color:'rgb(52,115, 225)',marginRight:'5px'}} />客服小巧</span>
                               <span><Icon type='qq' style={{fontSize:'16px',color:'rgb(52,115, 225)',marginRight:'5px'}} />客服小乔</span>
                           </div>
                       </div>
                           <Route exact path='/' component={HomePage}></Route>
                           <Route path='/about' component={About}></Route>
                           <Route path='/myselfInfo' component={MyselfInfo}></Route>
                           <Route path='/destination' component={Destination}></Route>
                           <Route path='/line' component={Line}></Route>
                           <Route path='/theme' component={Theme}></Route>
                           <Route path='/travels' component={Travels}></Route>
                           <Route path='/app/zhuce' component={ZhuceSection}></Route>
                           <Route path='/app/login' component={LoginSection}></Route>
                           <Route path='/app/search' component={Search}></Route>
                           <Route path='/admin' component={Admin}></Route>
                           <Route path='/cargoDetail/:name/:id' component={CargoDetail}></Route>
                           <Route path='/cargoUpdate/:id' component={CargoUpdate}></Route>
                           <Route path='/user/comment/:id' component={Comment}></Route>
                   </div>
               </Router>
            </div>
        )
    }
}
export default MyApp;
