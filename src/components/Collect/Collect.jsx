// 创建组件
import React, {Component} from 'react';
import { Table,Button,Avatar,message} from 'antd';
import axios from "axios/index";
class Collect extends Component {
    constructor(props) {
        super(props);
        this.state = {
            collects:[]
        }
    }
    //获取相应管理员的所有订单
    componentDidMount(){
        this.getCollectShow();
    }
    success = (msg) => {
        message.success(msg)
    };
    error = (msg) => {
        message.error(msg)
    };
    getCollectShow=()=>{
        axios.post('/user/get/collect').then((res) => {
            if(res.status===200){
               if(res.data.error===0){
                   const collects=[];
                   for(let i=0;i < res.data.collects.length;i++){
                       collects.push({
                           key:i,
                           name:res.data.collects[i].CollectName,
                           image:res.data.collects[i].CollectImage,
                           create_time:res.data.collects[i].create_time,
                           id:res.data.collects[i]._id
                       });
                       this.setState({
                           collects:collects
                       });
                       this.success(res.data.msg)
                   }
               }else{
                   this.error(res.data.msg)
               }
            }
        }).catch((err)=>{
            console.log(err);
        })
    }
    //点击删除收藏
    deleteCollect=(id,that)=>{
        // console.log(that);
        // console.log(id);
        let data = {
            token:localStorage.getItem("token"),
            username:localStorage.getItem("username"),
            CollectId:id
        };
        axios.post('/user/collect/delete',data).then((res) => {
            // console.log(res.data);
            if(res.data.error===0){
                this.success(res.data.msg);
                this.getCollectShow();
            }else{
                this.error(res.data.msg)
            }
        }).catch((err)=>{
            console.log(err);
        })
    };
    render() {
        const columns = [ {
            title: '商品图片',
            dataIndex: 'image',
            width:'15%',
            render:(record)=>{
                return <Avatar src={record} shape="square" size={100}  alt=""/>
            }}, {
            title: '商品名称',
            width:'10%',
            dataIndex: 'name',
        },
            {
                title: '添加时间',
                width:'20%',
                dataIndex: 'create_time',
                sorter: (a, b) => {
                   let stringA = a.create_time.toUpperCase();
                   let stringB = b.create_time.toUpperCase();
                    if (stringA < stringB) {
                        return -1;
                    }
                    if (stringA > stringB) {
                        return 1;
                    }
                    return 0;
                }
            },{
                title: '操作',
                width:'20%',
                dataIndex: 'id',
                render:(id)=>{ return (<Button onClick={this.deleteCollect.bind(this,id)}>删除</Button> ) },
            }];
        return (
            <div className='user_collect' style={{width:'80%'}}>
                {
                    this.state.collects.length>0 ?
                    <div>
                        <Table bordered
                               title={() => '购物车'}
                               columns={columns} pagination={{ pageSize:5}} dataSource={this.state.collects}>
                        </Table>
                    </div> : <h1>亲，还没有收藏商品哦！</h1>
                }
            </div>
        )
    }
}

export default Collect;


