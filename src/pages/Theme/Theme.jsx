// 创建组件
import React, {Component} from 'react';
import './Theme.css';
import {Col, Row,Card,message,Menu} from 'antd';
import axios from 'axios';
import {Link} from 'react-router-dom';
const { Meta } = Card;
class Theme extends Component {
    constructor(props) {
        super(props);
        this.state = {
            types:[],
            cargos:[],
            citys:[]
        }
    }
    success = (msg) => {
        message.success(msg)
    };
    error = (msg) => {
        message.error(msg)
    };
    //等价于watch
    componentWillReceiveProps(nextProps) {
        console.log(nextProps.match.params);
    }
    componentDidMount(){
        axios.get('/home/findCargoTheme').then((res)=>{
            if(res.status===200){
                if(res.data.error===0){
                    this.setState({
                        types:res.data.types
                    });
                    this.success(res.data.msg);
                }
                if(res.data.error===1){
                    this.error(res.data.msg);
                }
            }
        }).catch((err)=>{
            console.log(err);
        });
        this.getAll();
    };
    handleClick=(e)=>{
        // console.log(e.target.innerHTML);
        axios.get('/theme/content', {
                params: e.key
            }).then((res) => {
                console.log(res);
                this.setState({
                    cargos: res.data.cargos
                })
            }).catch((err) => {
                console.log(err);
            })
    };
    handleClickAll=(e)=>{
        this.getAll();
    };
    //全部
    getAll=()=>{
        axios.get('/home/findCargo').then((res) => {
            console.log(res);
            this.setState({
                cargos: res.data.cargos
            })
        }).catch((err) => {
            console.log(err);
        });
        axios.get('/city/content').then((res)=>{
            console.log(res);
            this.setState({
                citys: res.data.citys
            })
            }).catch((err) => {
            console.log(err);
            })
    };
    render() {
        return (
            <div className='theme'>
                     <Menu style={{width:'80vw',margin:'0 auto'}}   mode="horizontal">
                         <Menu.Item  onClick={this.handleClickAll.bind(this)}
                             style={{lineHeight:'50px',float:'left',width:'100px',cursor:'pointer',fontSize:'16px'}}
                         >
                             <p>全部</p>
                         </Menu.Item>
                         {
                             this.state.types.map((type,index)=>{
                                 return(
                                     <Menu.Item key={type} onClick={this.handleClick.bind(this)}
                                           style={{lineHeight:'50px',float:'left',width:'100px',cursor:'pointer',fontSize:'16px'}}>
                                         <p>{type}</p>
                                     </Menu.Item>
                                 )
                             })
                         }
                     </Menu>
                <Menu style={{width:'80vw',margin:'0 auto'}}   mode="horizontal">
                    <Menu.Item key='allCity' style={{lineHeight:'50px',float:'left',width:'100px',cursor:'pointer',fontSize:'16px'}}>
                        <p>出发城市</p>
                    </Menu.Item>
                    {
                        this.state.citys.map((city,index)=>{
                            return(
                                <Menu.Item key={city} onClick={this.handleClick.bind(this)}
                                           style={{lineHeight:'50px',float:'left',width:'100px',cursor:'pointer',fontSize:'16px'}}>
                                    <p>{city}</p>
                                </Menu.Item>
                            )
                        })
                    }
                </Menu>
                <div className='smallTitleContent' style={{width:'80vw',margin:'20px auto'}}>
                    <Row gutter={16}>
                        {
                            this.state.cargos.map((cargo,index)=>{
                                return(
                                    <Col span={5} key={index} >
                                        <Link to={'/cargoDetail/' + cargo.cargo_name + '/' + cargo._id} key={index} >
                                            <Card key={cargo._id} style={{width:'300px',position:'relative'}}
                                                  cover={<img alt="example" src={cargo.cargo_image} style={{width:'300px',height:'200px'}}/>}>
                                                <Meta
                                                    title={<h1 style={{position:'absolute',top:'70px',left:'100px',color:'#ffffff'}}>{cargo.cargo_name}</h1>}
                                                    description={
                                                        <div>
                                                                   <span style={{color:'red',fontSize:'40px',fontWeight:'800',marginRight:'20px',display:'block'}}>
                                                                       <strong style={{fontSize:'20px'}}>现价:</strong>
                                                                       {cargo.cargo_price}元
                                                                    </span>
                                                            <s>
                                                                   <span style={{color:'#8a8a8a',fontSize:'20px',display:'block'}}>
                                                                       原价:{cargo.before_price}
                                                                   </span>
                                                            </s>
                                                        </div>
                                                    }
                                                />
                                            </Card>
                                        </Link>
                                    </Col>
                                )
                            })
                        }
                    </Row>
                </div>
            </div>
        )
    }
}
export default Theme;
