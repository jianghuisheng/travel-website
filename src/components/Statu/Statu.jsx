// 创建组件
import React, {Component} from 'react';
import { Steps, List,Avatar,Popover,Button,message} from 'antd';
import './Statu.css';
import axios from "axios/index";

const Step = Steps.Step;

const customDot = (dot, { status, index }) => (
    <Popover content={<span>第{index}步， 状态: {status}</span>}>
        {dot}
    </Popover>
);

class Statu extends Component {
    constructor(props) {
        super(props);
        this.state = {
            orders:[]
        }
    }
    success = (msg) => {
        message.success(msg)
    };
    error = (msg) => {
        message.error(msg)
    };
    //获取相应管理员的所有订单
    componentDidMount(){
       this.getOrderStatus();
    }
    getOrderStatus=()=>{
        axios.post('/admin/get/order').then((res) => {
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
    }
    handleOrderStatus=(e)=>{
        e.preventDefault();
        // console.log(e.target.id);
        let data = {
            orderId:e.target.id,
            token:localStorage.getItem("token"),
            username:localStorage.getItem("username"),
        };
        axios.post('/admin/order/status',data).then((res)=>{
            if(res.status===200){
                if(res.data.error===0){
                   this.getOrderStatus();
                    this.success(res.data.msg);
                }
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
            <div className='user_order' style={{width:'80%',height:'100vh',overflowY:'scroll',padding:'20px',marginLeft:'30px'}}>
                {
                    this.state.orders.length>0 ?  <div>
                        <List itemLayout="horizontal" dataSource={this.state.orders} renderItem={item => (
                            <List.Item style={{height:'200px',position:'relative'}} >
                                <List.Item.Meta avatar={<Avatar src={item.shopImage} shape="square" size={100}/>}
                                                title={<p style={{fontSize:'30px'}}>{item.shopName}</p>}/>
                                <Steps size='small' progressDot={customDot} current={item.status}>
                                    <Step title="已支付" description='支付' />
                                    <Step title="待发货" description='发货'/>
                                    <Step title="在路上" description='快递'/>
                                    <Step title="待签收" description='签收'/>
                                    <Step title="待评价" description='评价'/>
                                </Steps>
                                <Button id={item._id} onClick={this.handleOrderStatus.bind(this)} style={{display:'inline-block'}}>下一步</Button>
                                {item.status ===5 && <strong style={{color:'red',marginLeft:'20px'}}>订单已完成</strong>}
                            </List.Item>
                        )}
                        />
                    </div> : <h1>亲，还没有客户下单哦！</h1>
                }
            </div>
        )
    }
}

export default Statu;

