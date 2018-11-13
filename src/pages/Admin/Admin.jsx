// 创建组件
import React, {Component} from 'react';
import './Admin.css';
import {Icon,Tabs} from 'antd';
import AddCargoPage from '../../components/AddCargoPage/AddCargoPage';
import CargoDelete from '../../components/CargoDelete/CargoDelete';
import Statu from '../../components/Statu/Statu';
const TabPane = Tabs.TabPane;

class Admin extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    render() {
        return (
            <div className='admin'>
                <Tabs tabPosition='left'style={{width:'100vw',background:'#f0f2f5',height:'100vh'}}>
                    <TabPane tab={<span style={{width:'8vw',display:'inline-block'}}><Icon type='user-add'/>添加商品</span>} key="addCargoPage">
                        <AddCargoPage/>
                    </TabPane>
                    <TabPane tab={<span><Icon type='user-delete'/>商品管理</span>} key="deleteCargoPage">
                        <CargoDelete/>
                    </TabPane>
                    <TabPane tab={<span><Icon type='info'/>订单进度</span>} key="adminInfo">
                       <Statu/>
                    </TabPane>
                </Tabs>
            </div>
        )
    }
}

export default Admin;
