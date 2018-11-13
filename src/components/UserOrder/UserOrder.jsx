// 创建组件
import React, {Component} from 'react';
import { Steps, List,Avatar,Popover,message,Button} from 'antd';
import axios from 'axios';
import {Link} from 'react-router-dom';
const Step = Steps.Step;

const customDot = (dot, { status, index }) => (
    <Popover content={<span>第{index}步， 状态: {status}</span>}>
        {dot}
    </Popover>
);
class UserOrder extends Component {
    constructor(props) {
        super(props);
        this.state = {
            orders:[],
            loading: false,
            visible: false,
        }
    }
    success = (msg) => {
        message.success(msg)
    };
    error = (msg) => {
        message.error(msg)
    };
    componentDidMount(){
       this.getOrderStatus();
    }
    getOrderStatus=()=>{
        axios.post('/user/get/order').then((res) => {
            if(res.status===200){
                if(res.data.error===0){
                    this.setState({
                        orders:res.data.orders
                    });
                }
                if(res.data.error===1){
                    this.error(res.data.msg);
                }
            }
        }).catch((err)=>{
            console.log(err);
        })
    };
    handleOrderStatus=(e)=>{
        e.preventDefault();
        console.log(e.target.id);
        let data = {
            orderId:e.target.id,
            token:localStorage.getItem("token"),
            username:localStorage.getItem("username"),
        };
        axios.post('/user/order/status',data).then((res)=>{
            if(res.status===200){
                if(res.data.error===0){
                    this.getOrderStatus();
                }
                this.success(res.data.msg)
                if(res.data.error===1){
                    this.error(res.data.msg);
                }
            }
        }).catch((err)=>{
            console.log(err);
        })
    };
    render() {
        return (
            <div className='user_order' style={{width:'80%'}}>
                {
                    this.state.orders.length>0 ?
                        <List itemLayout="horizontal" dataSource={this.state.orders} renderItem={item => (
                            <List.Item style={{height:'250px',position:'relative'}} >
                                <List.Item.Meta avatar={<Avatar shape="square" src={item.shopImage} size={100} />} title={<p style={{fontSize:'30px'}}>{item.shopName}</p>}/>
                                <Steps size='small' progressDot={customDot} current={item.status}>
                                    <Step title="已支付" description='支付' />
                                    <Step title="待发货" description='发货'/>
                                    <Step title="在路上" description='快递'/>
                                    <Step title="待签收" description='签收'/>
                                    <Step title="待评价" description='评价'/>
                                </Steps>
                                {item.status>=4 ? '':<Button id={item._id} onClick={this.handleOrderStatus.bind(this)} style={{display:'inline-block'}}>下一步</Button>}
                                {item.status===4 && <Link to={'/user/comment/' + item._id}><Button id={item._id} style={{marginLeft:'20px'}}>评价</Button></Link>}
                                {item.status ===5 && <strong style={{color:'red',marginLeft:'20px'}}>订单已完成</strong>}
                                </List.Item>
                        )}
                        />: <h1>亲，您的购物车商品还没结算</h1>
                }
            </div>
        )
    }
}

export default UserOrder;
