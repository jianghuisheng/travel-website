// 创建组件
import React, {Component} from 'react';
import { Menu,Row,Col,Button,Icon,Badge} from 'antd';
import './HeaderNav.css';
import logo from '../../images/logo2.png';
import {Link} from 'react-router-dom';
const SubMenu = Menu.SubMenu;
class HeaderNav extends Component {
    constructor(props) {
        super(props);
        this.state = {
            current: 'home'
        }
    }
    handleSign = () => {
        localStorage.clear();
    };
    handleClick = (e) => {
        console.log('click ', e);
        this.setState({
            current: e.key,
        });
    };
    render() {
        return (
            <div className='header-nav'>
               <Row>
                   <Col offset={1} span={1}>
                       <img src={logo} className='header-logo' alt=""/>
                   </Col>
                   <Col span={3}>
                      <h2>畅游高端定制旅游</h2>
                   </Col>
                   <Col span={10}>
                       <Menu  mode="horizontal" onClick={this.handleClick} selectedKeys={[this.state.current]} >
                           <Menu.Item key='home'><Link to='/'>首页</Link></Menu.Item>
                           <Menu.Item key='about'><Link to='/about'>关于我们</Link></Menu.Item>
                           <Menu.Item key='theme'><Link to='/theme'>精选主题</Link></Menu.Item>
                           <Menu.Item key='destination'><Link to='/destination'>目的地</Link></Menu.Item>
                           <Menu.Item key='travels'><Link to='/travels'>攻略游记</Link></Menu.Item>
                           <SubMenu key='find' title={<span><Icon type='setting'/>发现</span>}>
                               <Menu.Item key="myselfInfo" disabled={localStorage.getItem('username')?false:true}>
                                   <Link to='/myselfInfo'>个人资料</Link>
                               </Menu.Item>
                               {localStorage.getItem('admin') ==='true' &&
                               <Menu.Item key="admin" >
                                   <Badge dot={true}>
                                       <Link to='/admin'>管理员</Link>
                                   </Badge>
                               </Menu.Item>
                               }
                               <Menu.Item key="7">Option 7</Menu.Item>
                               <Menu.Item key="8">Option 8</Menu.Item>
                           </SubMenu>
                       </Menu>
                   </Col>
                   {localStorage.getItem('token') ?
                       <Col offset={3} span={1}>
                           <Link to='/app/login'><Button className='btnsign' onClick={this.handleSign.bind(this)}>退出</Button></Link>
                       </Col>
                       :
                       <Col offset={3} span={3}>
                            <Link to='/app/zhuce'><Button className='btnzhuce' style={{marginRight:'20px'}}>注册</Button></Link>
                            <Link to='/app/login'><Button className='btnlogin'>登陆</Button></Link>
                       </Col>
                   }
               </Row>
            </div>
        )
    }
}

export default HeaderNav;
