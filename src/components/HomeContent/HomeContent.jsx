import React, {Component} from 'react';
import {Col, Row,Button,Icon,Card,message} from 'antd';
import './HomeContent.css';
import {Link} from 'react-router-dom';
import axios from 'axios';
class HomeContent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cargos:[],
            redShow:false,
            num:4,
        }
    }
    success = (msg) => {
        message.success(msg)
    };
    error = (msg) => {
        message.error(msg)
    };
    handleCollected=()=>{
        this.setState({
            redShow:true
        })
    };
    //加载更多
    loadingMore=()=>{
        let sum = this.state.num + 4;
        this.setState({
            num:sum
        })
    };
    componentDidMount(){
        axios.get('/home/findCargo').then((res)=>{
            if(res.status===200){
                if(res.data.error===0){
                    this.setState({
                        cargos:res.data.cargos
                    });
                    this.success(res.data.msg);
                }
                if(res.data.error===1){
                    this.error(res.data.msg);
                }
            }
        }).catch((err)=>{
            console.log(err);
        })
    }
    render() {
        return (
            <div className='home_content'>
                <ul className='home'>
                    <li>
                        <div className='smallTitle'>
                            <strong className='caption'>热门主题</strong>
                            <span className='subtitle'>Popular Destination</span>
                        </div>
                        <div className='smallTitleContent'>
                            <Row gutter={16}>
                                {
                                    this.state.cargos.map((cargo,index)=>{
                                        return(
                                            <Link to={'/cargoDetail/' + cargo.cargo_name + '/' + cargo._id} key={index} >
                                                {
                                                    index < this.state.num &&
                                                    <Col span={6} key={index} >
                                                        <Card
                                                            key={cargo._id}
                                                            style={{ width:'300',height:'400px'}}
                                                            cover={<img alt="example" src={cargo.cargo_image} style={{width:'100%',height:'100%'}}/>}>
                                                            <h1 className='cargo_title'>{cargo.cargo_name}</h1>
                                                            <div className='cargo_ceng'>
                                                                <p className='description_top'>{cargo.description}</p>
                                                                <p className='description_bottom'>￥<span style={{fontSize:'30px',color:'red'}}>{cargo.cargo_price}</span>/人起</p>
                                                            </div>
                                                        </Card>
                                                    </Col>
                                                }
                                            </Link>
                                        )
                                    })
                                }
                            </Row>
                        </div>
                        <Row gutter={16}>
                            <Col span={24}>
                                <Button className='loadingMore' style={{marginTop:'20px'}} onClick={this.loadingMore.bind(this)} block>
                                    <Icon className='plus' type='plus'></Icon>
                                </Button>
                            </Col>
                        </Row>
                    </li>
                </ul>
            </div>
        )
    }
}

export default HomeContent;
