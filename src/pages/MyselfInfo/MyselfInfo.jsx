// 创建组件
import React, {Component} from 'react';
import './MyselfInfo.css';
import { Layout,Tabs, Icon} from 'antd';
import axios from 'axios';
import MyMap from '../../components/MyMap/MyMap';
import Info from '../../components/Info/Info';
import ShopCart from '../../components/ShopCart/ShopCart';
import UserOrder from '../../components/UserOrder/UserOrder';
import Collect from '../../components/Collect/Collect';
const { Header,Content} = Layout;
const TabPane = Tabs.TabPane;
// const aa = (bb)=>{
//     return require('../../images/' + bb +'.jpg')
// };

class MyselfInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userInfo:''
        }
    }
    componentDidMount(){
        axios.get('/user/info',{
            params:{
                infoUser:localStorage.getItem('username'),
            }
        }).then((res)=>{
           this.setState({
               userInfo:res.data.user
           });
            // console.log(this.state.userInfo.headPhoto);
        }).catch((err)=>{
            console.log(err);
        })
    }
    render() {
        return (
            <div className='myselfInfo'>
                <Header style={{ position: 'relative', zIndex:1001,marginLeft:'10vw', width: '80vw',height:'20vh',backgroundColor:'rgb(255,255,255)'
                    ,borderBottom:'1px solid #ccc',overflow:'hidden'}}>
                    <div className="logo1" style={{display:'inline-block',marginTop:'20px'}}>
                        <img src={this.state.userInfo.headPhoto} alt=''/>
                    </div>
                    <div className="info" style={{marginLeft:'20px'}}>
                         <span style={{color:'gray',fontSize:'50px'}}>{this.state.userInfo.username}</span>
                            { this.state.userInfo.admin && <Icon type='crown' style={{fontSize:'30px',marginLeft:'20px',color:'orange'}}/>}
                          <span style={{display:'block',fontSize:'15px',lineHeight:'25px',fontWeight:'bold'}}>
                            收藏
                            <strong style={{fontSize:'20px',color:'#8a8a8a'}}>
                                 <Icon type='heart' style={{marginLeft:'10px',marginRight:'5px',color:'red',fontSize:'20px'}}/>
                                {this.state.userInfo.collect}
                            </strong>
                        </span>
                        <span style={{display:'block',fontSize:'15px',lineHeight:'25px',fontWeight:'bold'}}>
                           购物车
                            <strong style={{fontSize:'20px',color:'#8a8a8a'}}>
                                 <Icon type='shopping-cart' style={{marginLeft:'10px',marginRight:'5px',color:'red',fontSize:'23px'}}/>
                                {this.state.userInfo.cart_goods_num}
                            </strong>
                        </span>
                     </div>
                </Header>
                <Content style={{height:'70vh',width:'80vw',position: 'fixed',top:'30vh',left:'10vw',backgroundColor:'rgb(255,255,255)'}}>
                    <Tabs tabPosition='left' style={{width:'80vw'}}>
                        <TabPane tab={<span className="nav-text" style={{width:'8vw',display:'inline-block'}}><Icon type="user" />个人资料</span>} key={1}>
                            <div style={{width:'100%',paddingTop:'20px',height:'70vh',overflowY:'scroll'}}>
                                <Info/>
                            </div>
                        </TabPane>
                        <TabPane tab={<span className="nav-text"><Icon type="shopping-cart"/>购物车页</span>} key="2">
                            <div style={{width:'100%',paddingTop:'20px',height:'70vh',overflowY:'scroll'}}>
                              <ShopCart/>
                            </div>
                        </TabPane>
                        <TabPane tab={<span className="nav-text"><Icon type="upload" />订单页面</span>} key="3">
                            <div style={{width:'100%',paddingTop:'20px',height:'70vh',overflowY:'scroll'}}>
                               <UserOrder/>
                            </div>
                        </TabPane>
                        <TabPane tab={<span className="nav-text"><Icon type="bar-chart" />收藏商品</span>} key="4">
                            <div style={{width:'100%',paddingTop:'20px',height:'70vh',overflowY:'scroll'}}>
                                <Collect/>
                            </div>
                        </TabPane>
                        <TabPane tab={ <span className="nav-text"><Icon type="cloud-o" />实时天气</span>} key="5">
                        </TabPane>
                        <TabPane tab={ <span className="nav-text"> <Icon type="appstore-o" />软件商店</span>} key="6">
                        </TabPane>
                        <TabPane tab={ <span className="nav-text"><Icon type="team" />大众群聊</span>} key="7">
                        </TabPane>
                        <TabPane tab={  <span className="nav-text"> <Icon type="shop" />周边商店</span>} key="8">
                            <div style={{width:'100%',height:'70vh',marginLeft:'-24px'}}>
                                <MyMap/>
                            </div>
                        </TabPane>
                    </Tabs>
                </Content>
            </div>
        )
    }
}

export default MyselfInfo;
